-- Supabase table schema for live_scores
-- Run this SQL in your Supabase SQL Editor to create the table

-- Create the live_scores table
CREATE TABLE IF NOT EXISTS live_scores (
    id BIGSERIAL PRIMARY KEY,
    tournament_name TEXT NOT NULL DEFAULT 'Cowbell',
    team TEXT NOT NULL,
    player TEXT NOT NULL,
    tournaments TEXT, -- Combined tournament string (e.g., "Cowbell: Game1, Game2")
    games TEXT, -- Combined games string (e.g., "Game1, Game2")
    assists INTEGER NOT NULL DEFAULT 0,
    goals INTEGER NOT NULL DEFAULT 0,
    ds INTEGER NOT NULL DEFAULT 0,
    turnovers INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    captain_score NUMERIC(10, 2) NOT NULL DEFAULT 0,
    handler_score NUMERIC(10, 2) NOT NULL DEFAULT 0,
    cutter_score NUMERIC(10, 2) NOT NULL DEFAULT 0,
    defender_score NUMERIC(10, 2) NOT NULL DEFAULT 0,
    questionable BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- Ensure unique combination of tournament_name, team, and player
    UNIQUE(tournament_name, team, player)
);

-- Create index for faster queries by tournament_name
CREATE INDEX IF NOT EXISTS idx_live_scores_tournament_name ON live_scores(tournament_name);

-- Create index for faster queries by team
CREATE INDEX IF NOT EXISTS idx_live_scores_team ON live_scores(team);

-- Create index for faster queries by player
CREATE INDEX IF NOT EXISTS idx_live_scores_player ON live_scores(player);

-- Create index for updated_at to track when data was last refreshed
CREATE INDEX IF NOT EXISTS idx_live_scores_updated_at ON live_scores(updated_at);

-- Enable Row Level Security (RLS) - adjust policies based on your needs
ALTER TABLE live_scores ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your security needs)
-- For service role access, you may want to disable RLS or create appropriate policies
CREATE POLICY "Allow all operations for service role" ON live_scores
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_live_scores_updated_at BEFORE UPDATE ON live_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

