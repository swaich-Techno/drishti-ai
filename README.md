# Drishti AI

Drishti AI is a free-beta astrology chat app built with Next.js. Users can create an account, log in, ask spiritual or astrology-style questions, and keep a history of their past chats.

This version is designed to be:

- free to use right now
- easy to upload to GitHub
- easy to deploy on Vercel
- able to use MongoDB Atlas free tier for persistent login and chat history

## Features

- Email and password signup/login
- Cookie-based sessions
- Saved chat history per user
- Free-beta workspace with room for future premium plans
- Astrology, numerology, tarot, and kundli-inspired chat modes
- Works with MongoDB for persistence
- Falls back to in-memory storage if MongoDB is not configured locally

## Important honesty note

This app does not calculate exact Vedic charts, exact planetary positions, or formal kundli matching. The responses are guidance-style and rule-based so the project can stay free and easy to run. Later, you can replace the response engine with a paid AI model or a premium astrology backend.

## Tech stack

- Next.js 14
- React 18
- MongoDB Atlas free tier
- Custom auth with secure hashed passwords and cookie sessions

## Local setup

1. Install dependencies:

```powershell
npm.cmd install
```

2. Copy the example env file:

```powershell
Copy-Item .env.example .env.local
```

3. Add your MongoDB connection string to `.env.local`.

4. Start the app:

```powershell
npm.cmd run dev
```

5. Open:

```text
http://localhost:3000
```

## Environment variables

See `.env.example`.

If `MONGODB_URI` is missing, the app still runs locally, but users/chats only live in memory for the current local process. On Vercel, you should treat `MONGODB_URI` as required for signup, login, and chat history.

## MongoDB Atlas free tier

1. Create a free cluster in MongoDB Atlas.
2. Create a database user.
3. Add your IP address or allow access from anywhere for testing.
4. Copy the connection string into `MONGODB_URI`.
5. Optional: change `MONGODB_DB_NAME` if you want a custom database name.

## Deploy to Vercel

1. Upload this folder to GitHub.
2. Import the GitHub repo into Vercel.
3. Add the same environment variables in Vercel Project Settings.
4. Deploy.

## Future premium ideas

- Paid daily or monthly plans
- Longer memory per user
- PDF reports
- Voice or image-based readings
- Real AI model integration
- Advanced compatibility reports
