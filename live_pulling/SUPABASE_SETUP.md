# Supabase Setup Instructions

This guide will help you set up Supabase for the live scores functionality.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- Access to your Supabase project dashboard

## Step 1: Create the Table

1. Log in to your Supabase dashboard
2. Navigate to your project
3. Go to the **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `supabase_schema.sql` into the editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

This will create the `live_scores` table with all necessary columns, indexes, and constraints.

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Find your **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
3. Find your **service_role** key (under "Project API keys" → "service_role" - **keep this secret!**)
   - ⚠️ **Important**: Use the `service_role` key, not the `anon` key, as it has full database access needed for this script

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   - **Name**: `SUPABASE_URL`
     - **Value**: Your Supabase Project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)

   - **Name**: `SUPABASE_KEY`
     - **Value**: Your Supabase service_role key

## Step 4: Test the Setup

1. Go to your GitHub repository → **Actions** tab
2. Select **Pull Player Data** workflow
3. Click **Run workflow** → **Run workflow**
4. Check the workflow logs to verify it runs successfully
5. In Supabase, go to **Table Editor** → `live_scores` to verify data was inserted

## Table Schema Overview

The `live_scores` table contains:

- **tournament_name**: Tournament name (hardcoded as "Cowbell" in the script)
- **team**: Team name
- **player**: Player name
- **tournaments**: Combined tournament string
- **games**: Combined games string
- **assists**, **goals**, **ds**, **turnovers**: Player statistics
- **price**: Calculated player price
- **games_played**: Number of games played
- **captain_score**, **handler_score**, **cutter_score**, **defender_score**: Calculated scores
- **questionable**: Boolean flag for potential injuries
- **updated_at**: Timestamp of last update (automatically managed)

## How It Works

Every time the GitHub Action runs:

1. The script downloads player data from UltiAnalytics
2. Processes and filters for the Cowbell tournament
3. Calculates scores and prices
4. **Deletes all existing records** for the "Cowbell" tournament
5. **Inserts all new records** with the latest data

This ensures the table always contains the most up-to-date data for the tournament.

## Querying the Data

You can query the data from Supabase using:

```sql
-- Get all players for Cowbell tournament
SELECT * FROM live_scores WHERE tournament_name = 'Cowbell';

-- Get players by team
SELECT * FROM live_scores WHERE tournament_name = 'Cowbell' AND team = 'Auburn';

-- Get top players by captain score
SELECT player, team, captain_score 
FROM live_scores 
WHERE tournament_name = 'Cowbell' 
ORDER BY captain_score DESC 
LIMIT 10;
```

## Troubleshooting

### Error: "Missing Supabase credentials"
- Make sure you've added `SUPABASE_URL` and `SUPABASE_KEY` as GitHub secrets
- Verify the secrets are spelled correctly (case-sensitive)

### Error: "relation 'live_scores' does not exist"
- Make sure you've run the SQL schema file in Supabase SQL Editor
- Check that the table was created successfully

### Error: "permission denied"
- Make sure you're using the `service_role` key, not the `anon` key
- Check that Row Level Security (RLS) policies allow the operation (the schema includes a permissive policy)

### No data appears in the table
- Check the GitHub Actions logs for errors
- Verify that player data exists for the Cowbell tournament in UltiAnalytics
- Make sure the tournament name contains "cow" (case-insensitive) to match the filter

