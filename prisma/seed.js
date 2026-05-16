import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";

async function main() {
    const username = process.env.AUTHOR_USERNAME;
    const password = process.env.AUTHOR_PASSWORD;

    const existing = await prisma.user.findUnique({
        where: { username }
    });

    if (existing) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username,
            displayName: username,
            password: hashedPassword,
            role: "AUTHOR",
            provider: "LOCAL",
        }
    });

    console.log("Admin created");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });