# Crispy

Crispy is a multi-person CMS project built with Next.js. It is designed to be fast, secure, and easy to use. The project is built with TypeScript and uses Bun as its runtime.

## Modules

- Users, Roles & Permissions
- Tags
- Configurations
- Categories
- Enums
- Handbooks (Browser Bookmarks)
- Blogs

## Getting Started

```bash
bun dev
```

Open [http://localhost:4000](http://localhost:4000)

## Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Self-host

```bash
bun build
bun start
```

## Prisma Database Commands

```bash
bun db:studio    # Launch Prisma Studio, a visual database management tool
bun db:generate  # Generate Prisma Client
bun db:migrate   # Create and apply database migrations
bun db:reset     # Reset the database (this will delete all data)
bun db:push      # Push schema changes directly to the database (for development)
```
