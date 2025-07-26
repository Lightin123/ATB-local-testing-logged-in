import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();



export async function createUser(req, res) {
    const { email, password, first_name, last_name, role, propertyId, unitIds = [], code } = req.body;
    void propertyId; // propertyId reserved for future logic
    try {
        const whitelist = await prisma.whitelistedUser.findUnique({ where: { email } });
        const finalRole = role || whitelist?.role || 'TENANT';

        if (!whitelist && !role) {
            return res.status(403).json({ message: 'You are not authorized to sign up.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        let createdUser;
        await prisma.$transaction(async tx => {
            const data = {
                email,
                password: hashedPassword,
                firstName: first_name,
                lastName: last_name,
                salt,
                name: first_name + ' ' + last_name,
                role: finalRole,
            };
            if (finalRole === 'TENANT') {
                data.tenant = { create: {} };
            }

            const newUser = await tx.user.create({ data, include: { tenant: true } });

            if (whitelist) {
                await tx.whitelistedUser.delete({ where: { id: whitelist.id } });
            }

            if (Array.isArray(unitIds) && unitIds.length) {
                if (finalRole === 'TENANT' && newUser.tenant) {
                    for (const id of unitIds) {
                        await tx.unit.update({
                            where: { id: Number(id) },
                            data: { tenant: { connect: { id: newUser.tenant.id } } }
                        });
                    }
                } else if (finalRole === 'OWNER') {
                    if (code) {
                        const validCode = await tx.overwriteCode.findFirst({
                            where: { code, used: false, expiresAt: { gt: new Date() } }
                        });
                        if (!validCode) {
                            throw new Error('INVALID_CODE');
                        }
                        for (const id of unitIds) {
                            const unit = await tx.unit.findUnique({
                                where: { id: Number(id) },
                                include: { owners: true }
                            });
                            const prevOwner = unit?.owners?.[0];
                            await tx.unit.update({
                                where: { id: Number(id) },
                                data: { owners: { set: [{ id: newUser.id }] } }
                            });
                            if (prevOwner) {
                                await tx.user.update({
                                    where: { id: prevOwner.id },
                                    data: { email, password: hashedPassword }
                                });
                            }
                        }
                        await tx.overwriteCode.update({
                            where: { id: validCode.id },
                            data: { used: true, usedById: newUser.id }
                        });
                    } else {
                        for (const id of unitIds) {
                            await tx.unit.update({
                                where: { id: Number(id) },
                                data: { owners: { connect: { id: newUser.id } } }
                            });
                        }
                    }
                }
            }

            createdUser = newUser;
        });

        res.status(201).json({ message: 'User created successfully', user: createdUser });
    }
    catch (error) {
        if (error.message === 'INVALID_CODE') {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'User with that email already exists' });
        } else {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // eslint-disable-next-line no-undef
        const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

        // eslint-disable-next-line no-undef
        const refreshToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

        res.status(200).json({ message: "Login successful", accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}

export async function refresh(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token is required" });
    }

    try {
        // Verify the refresh token
        // eslint-disable-next-line no-undef
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: {
                id: payload.userId,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid user" });
        }

        // Generate new access token and refresh token
        // eslint-disable-next-line no-undef
        const newAccessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        // eslint-disable-next-line no-undef
        const newRefreshToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

        res.status(200).json({ message: "Refresh successful", accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });
    }
}


export function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];

    // eslint-disable-next-line no-undef
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is required" });
    }

    try {
        // eslint-disable-next-line no-undef
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

