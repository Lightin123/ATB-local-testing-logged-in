import fs from "fs";
import crypto from "crypto";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Default seed password
  const defaultPassword = "SeedPass123!";

  // Helper to generate a random salt per user
  function genSalt() {
    return crypto.randomBytes(16).toString("hex");
  }

  // 1) Find or create Parkway Lane
  let property = await prisma.realEstateObject.findFirst({
    where: { title: "Parkway Lane" },
  });

  if (!property) {
    property = await prisma.realEstateObject.create({
      data: {
        title: "Parkway Lane",
        // add any other required fields here
      },
    });
  }

  // 2) Read CSV rows
  const records = [];
  fs.createReadStream("Parkway Lane Owner List 20250628.csv")
    .pipe(parse({ columns: true, skip_empty_lines: true }))
    .on("data", row => records.push(row))
    .on("end", async () => {
      // 3) Loop & upsert each unit + owner
      for (const row of records) {
        const unitNumber = row["Legal Description"];
        const address    = row["Address"];
        const [firstName, ...rest] = row["Owner Name"].trim().split(" ");
        const lastName   = rest.join(" ") || "";

        // Upsert owner user
        // generate a valid email (no spaces) and sanitize it
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '.') + '@example.com';
        const sanitizedEmail = email.trim().toLowerCase();

        const owner = await prisma.user.upsert({
          where:  { email: sanitizedEmail },
          update: {
            firstName,
            lastName,
            street: address,
            // optional: rotate salt on update
            salt: genSalt()
          },
          create: {
            firstName,
            lastName,
            email: sanitizedEmail,
            street: address,
            password: defaultPassword,
            salt: genSalt()
          },
        });

      // find existing unit by realEstateObjectId & unitNumber
      let unit = await prisma.unit.findFirst({
        where: {
          realEstateObjectId: property.id,
          unitNumber: unitNumber
        }
      });

      if (unit) {
        // update the existing unit
        await prisma.unit.update({
          where: { id: unit.id },
          data: {
            unitIdentifier: address,
            owners: { connect: { id: owner.id } }
          }
        });
      } else {
        // create a new unit
        await prisma.unit.create({
          data: {
            realEstateObjectId: property.id,
            unitNumber: unitNumber,
            unitIdentifier: address,
            owners: { connect: { id: owner.id } }
          }
        });
      }
      }

      console.log("🌱  Seeding complete");
      await prisma.$disconnect();
    });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
