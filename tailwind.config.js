# Drishti AI

This project is now a deployable free Next.js app with:

- a proper App Router root layout
- a working reading API
- free astrology, numerology, tarot and kundli flows
- beginner-friendly GitHub and Vercel setup

## What changed

- Added the missing `app/layout.js`, which Next.js requires for App Router builds.
- Added the missing `/api/reading` route used by the reading page.
- Removed the Razorpay subscription flow.
- Opened all reading modes for free use.
- Simplified the home page, reading page and dashboard copy.
- Kept the upgraded Next.js version at `14.2.35`.

## Local run

```bash
npm install
npm run dev
```

## GitHub and Vercel steps

1. Upload this project folder to a new GitHub repository.
2. In Vercel, click `Add New Project`.
3. Import the GitHub repository.
4. Deploy with the default settings.

## Environment variables

No environment variables are required for the current free version.

## Notes

- The reading page works without payment setup.
- If you want to add login, database storage or paid plans later, those can be added in a future version.
