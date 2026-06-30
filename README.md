# 🦸 Community Hero — Hyperlocal Issue Resolution Platform

**Problem Statement:** Community Hero — Hyperlocal Problem Solver  
**Hackathon:** COD NINJA HACKATHON  
**Team:** [Your Name]

---

## Overview

Community Hero is an AI-powered civic platform that enables citizens to report, validate, track, and resolve local community issues (potholes, water leaks, broken streetlights, garbage, etc.). The platform uses Google Gemini AI to automatically categorize issues, assess severity, and predict escalation risks — making community problem-solving transparent, collaborative, and efficient.

## Key Features

- **AI-Powered Issue Reporting** — Upload a photo + description; Gemini AI auto-categorizes, assesses severity, and estimates urgency
- **Interactive Map** — Pin issues on an OpenStreetMap/Leaflet map with reverse geocoding to street addresses
- **Community Verification** — Upvote/downvote system to validate issue legitimacy
- **Real-Time Tracking** — Status timeline (reported → verified → in-progress → resolved) with live Firestore updates
- **AI Escalation Prediction** — Predict which issues may worsen using Gemini AI
- **Impact Dashboard** — Charts showing status distribution, monthly trends, and category breakdown
- **Gamification** — Points, badges (6 tiers), and a community leaderboard
- **Comments & Discussion** — Threaded comments on each issue
- **Google Sign-In** — One-click authentication via Firebase Auth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Lucide Icons |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap (free, no API key) |
| Geocoding | Nominatim (free) |
| Auth | Firebase Authentication (Google OAuth) |
| Database | Firestore (NoSQL, real-time) |
| AI | Google Gemini 1.5 Flash |
| Deployment | Google Cloud Run (Docker) |

## Google Technologies Used

1. **Google Gemini AI** — Issue categorization, severity assessment, escalation prediction
2. **Google Firebase Authentication** — Google Sign-In for user auth
3. **Google Cloud Firestore** — Real-time NoSQL database for issues, users, and comments
4. **Google Cloud Run** — Containerized deployment (Docker)

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project (free Spark plan)
- Gemini API key (free from aistudio.google.com)

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_key
```

### Run Locally

```bash
npm install
npm run dev
```

### Deploy to Google Cloud Run

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/community-hero

# Deploy to Cloud Run
gcloud run deploy community-hero \
  --image gcr.io/YOUR_PROJECT_ID/community-hero \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key"
```

## Project Structure

```
src/
├── app/
│   ├── api/            # Server API routes (categorize, predict, issues)
│   ├── dashboard/      # User dashboard with charts
│   ├── issue/[id]/     # Issue detail page
│   ├── issues/         # Browse all issues (list + map view)
│   ├── leaderboard/    # Community leaderboard
│   ├── login/          # Google sign-in
│   ├── profile/        # User profile with badges
│   ├── report/         # Issue reporting wizard (3-step)
│   ├── layout.js       # Root layout
│   └── page.js         # Landing page
├── components/         # Reusable UI components
├── context/            # Auth context provider
└── lib/                # Firebase, Gemini, helpers
```

## Security

- Gemini API key is **server-side only** — never exposed to the browser
- All API calls to Gemini are proxied through Next.js API routes
- `.env.local` is gitignored
- Firebase Firestore: read public, write requires authentication
