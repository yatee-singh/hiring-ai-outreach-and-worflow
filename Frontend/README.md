# Hunar Reach — People Search & Voice Reachout (UI)

React frontend for the recruiting workflow: paste a job description, pick a people-search provider (PDL, Apollo.io, Proxycurl, Coresignal), browse mock matches, run a Voice AI reachout, and file answers on a dashboard.

**UI only.** Search, calls, and transcripts are mocked. No backend or third-party APIs.

## Run locally

Use Node 20 (see `.nvmrc`):

```bash
nvm use
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Screens

1. **Job search** — JD + provider
2. **People** — ranked candidate list
3. **Voice reachout** — mock agent call + live transcript
4. **Dashboard** — extracted Q&A and outcomes
