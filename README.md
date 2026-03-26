This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Auth Setup (Clerk)

1. Create a Clerk app in the Clerk dashboard.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Start the app:

```bash
npm run dev
```

4. Visit:
   - `/sign-in`
   - `/sign-up`

Clerk is wired into the app via:
- `src/app/layout.tsx` (`ClerkProvider`)
- `src/middleware.ts` (`clerkMiddleware`)
- `src/components/layout/Navbar.tsx` (login/signup/user menu)

## History Persistence (Prisma + Postgres)

1. Add `DATABASE_URL` in `.env.local` (Postgres connection string).
2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Push schema to DB (or run migrations):

```bash
npm run prisma:push
# or
npm run prisma:migrate
```

Note: Prisma 7 client in this project uses the Postgres driver adapter (`@prisma/adapter-pg`) and requires `DATABASE_URL` in `.env.local`.

History APIs:
- `GET/POST /api/workout-history`
- `GET /api/workout-history/:id/pdf`
- `GET /api/meal-history`

User history page:
- `/my-history` (also linked in navbar as **My History**)
- Workout entries in `/my-history` support one-click PDF export.

## Production Deploy (Vercel)

This project is configured for Vercel production builds using:

- `vercel.json`:
  - `buildCommand: npm run vercel-build`
- `package.json` scripts:
  - `vercel-build`: `prisma generate && prisma migrate deploy && next build`
  - `postinstall`: `prisma generate`

### 1. Use hosted Postgres

Do **not** use localhost in production. Set `DATABASE_URL` to a hosted Postgres provider:
- Neon
- Supabase
- Railway
- Vercel Postgres

### 2. Set Vercel Environment Variables

In your Vercel project settings, add:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `GOOGLE_API_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional, defaults to `gemini-2.5-flash`)

### 3. Clerk production domain setup

In Clerk dashboard:
- Add your Vercel production domain under allowed origins/redirects.
- Ensure sign-in/sign-up routes (`/sign-in`, `/sign-up`) are enabled for that domain.

### 4. Deploy

Push to the connected branch and deploy on Vercel. During build:
- Prisma client is generated.
- Prisma migrations are deployed.
- Next.js app is built.

### 5. Verify after deploy

1. Sign up / sign in works from navbar and `/sign-in`, `/sign-up`.
2. Generate and save workout plan.
3. Generate and save meal plan.
4. Open `/my-history` while signed in and verify:
   - workout PDF download works
   - meal PDF download works
   - combined PDF download works
5. Open `/my-history` while signed out and verify placeholder view is shown.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
