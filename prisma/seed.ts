import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {  
  const adminRoleName = "Admin";
  const adminEmail = "info@tokma.ai";
  const adminPassword = "P@ssw0rd";

  var adminRole = await prisma.role.findUnique({
    where: { name: adminRoleName }
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: adminRoleName
      }
    });
    console.log("Admin role created successfully!");
  } else {
    console.log("Admin role already exists.");
  }

  var adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminUser) {
    const hash = await bcrypt.hash(adminPassword, 10);

    adminUser = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        passwordHash: hash,
      }
    });
    console.log("Admin user created successfully!");
  } else {
    console.log("Admin user already exists.");
  }

  var adminUserRole = await prisma.user_role.findFirst({
    where: { userId: adminUser.id, roleId: adminRole.id }
  });
  if (!adminUserRole) {
    adminUserRole = await prisma.user_role.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    });
    console.log("Admin user assigned to role successfully!");
  } else {
    console.log("Admin user role already exists.");
  } 
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  }).finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // important to close pool
  });