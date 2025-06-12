import { PrismaClient } from '../../prisma'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as { prisma?: PrismaClient }

// Ensure the prisma instance is re-used during hot-reloading
// Otherwise, a new client will be created on every reload
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prisma
