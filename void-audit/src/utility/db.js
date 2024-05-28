import { PrismaClient } from "@prisma/client";

let prisma;

// Check if Prisma instance exists, if not, create a new one
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();

} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;