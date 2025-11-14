# Frisbee Fantasy Frontend

A React + Vite + TypeScript frontend for managing fantasy frisbee teams.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `ui/` directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Set up the Supabase database:
   - Run the SQL in `user_teams_schema.sql` in your Supabase SQL Editor
   - Configure Google OAuth in Supabase Dashboard (Authentication → Providers → Google)
   - Add your redirect URLs (e.g., `http://localhost:5173/players` for local, and your GitHub Pages URL for production)

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## GitHub Pages Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on push to main.

### Setup Steps:

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. Add GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key

3. Configure base path (if needed):
   - If your repository is not at the root (e.g., `github.com/username/frisbee-fantasy`), update `vite.config.ts` to set the correct base path
   - Or add `VITE_BASE_PATH` as a GitHub Secret

4. Push to main branch to trigger deployment

## Features

- Google OAuth authentication via Supabase
- Browse all available players from `live_scores` table
- Add players to specific team positions (1 captain, 2 handlers, 2 cutters, 2 defenders)
- View team with live scores displayed by position
- Real-time score updates from `live_scores` table
- Clean white/gray/black UI design
