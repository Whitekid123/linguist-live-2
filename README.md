# Linguist Live

An immersive AI-powered language learning app with real-time conversations.

## Features

- Real-time voice conversations with AI
- Multiple language scenarios (Spanish, French, German, Italian, Portuguese)
- Audio transcription and response
- Interactive roleplay scenarios

## Run Locally

**Prerequisites:** Node.js

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and set your `GEMINI_API_KEY`
4. Run the app: `npm run dev`

## Deploy

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any static hosting service. Set the `GEMINI_API_KEY` environment variable during build.

## Tech Stack

- React + TypeScript
- Vite
- Google Gemini Live API
- Tailwind CSS
