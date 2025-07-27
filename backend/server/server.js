import express from 'express';
import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import * as authController from './controllers/authController.js';
import { authenticateToken } from './controllers/authController.js';
import { authorizeRoles } from './middleware/authorizeRoles.js';
import * as miscController from './controllers/miscController.js';
import * as realEstateController from './controllers/realEstateController.js';
import * as leaseController from './controllers/leaseController.js';
import * as tenantController from './controllers/tenantController.js';
import * as paymentController from './controllers/paymentController.js';
import * as expenseController from './controllers/expenseController.js';
import { checkOverduePayments } from './jobs/overduePayments.js';

import maintenanceRouter from './routes/maintenanceRouter.js';
import userRouter from './routes/userRouter.js';
import propertyRouter from './routes/propertyRouter.js';
import unitRouter from './routes/unitRouter.js';
import tenantRouter from './routes/tenantRouter.js';
import leaseRouter from './routes/leaseRouter.js';
import paymentRouter from './routes/paymentRouter.js';
import expenseRouter from './routes/expenseRouter.js';
import messageRouter from './routes/messageRouter.js';
import adminWhitelistRouter from './routes/adminWhitelist.js';
import adminRouter from './routes/adminRouter.js';
import contactRouter from './routes/contactRouter.js';
import authRoutes from './routes/authRoutes.js';

const PORT = process.env.PORT || 3000;
const app = express();
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const maintenanceIo = io.of('/maintenance');

// Authenticate socket connections using JWT token from handshake
maintenanceIo.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Unauthorized'));
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

// Basic connection handler
maintenanceIo.on('connection', socket => {
  console.log(`Socket.IO: client connected (${socket.id})`);
  socket.on('disconnect', () => {
    console.log(`Socket.IO: client disconnected (${socket.id})`);
  });
});
const rootRouter = express.Router();

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers under /api to match front-end calls
app.use('/api/contact', contactRouter);
app.use('/api/admin/whitelist', adminWhitelistRouter);
app.use('/api/admin', adminRouter);
app.use('/api/maintenance', maintenanceRouter);

// Mount resource routers
app.use('/api/user', userRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/units', unitRouter);
app.use('/api/tenants', tenantRouter);
app.use('/api/leases', leaseRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/messages', messageRouter);
app.use('/api', authRoutes);

// Root auth & misc routes
app.use('/', rootRouter);

// Health-check
app.get('/', (req, res) => res.send('Hello World!'));

// Auth routes
rootRouter.post('/signup', authController.createUser);
rootRouter.post('/login', authController.login);
rootRouter.post('/refresh', authController.refresh);

// Other routes unchanged...
// Overdue payments job
cron.schedule('0 0 * * *', checkOverduePayments);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

