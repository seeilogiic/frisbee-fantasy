-- Supabase table schema for user_teams
-- Run this SQL in your Supabase SQL Editor to create the table

-- Create the user_teams table
CREATE TABLE IF NOT EXISTS user_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    captain TEXT,
    handler_1 TEXT,
    handler_2 TEXT,
    cutter_1 TEXT,
    cutter_2 TEXT,
    defender_1 TEXT,
    defender_2 TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- Ensure one team per user
    UNIQUE(user_id)
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_user_teams_user_id ON user_teams(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own team
CREATE POLICY "Users can read their own team" ON user_teams
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own team
CREATE POLICY "Users can insert their own team" ON user_teams
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own team
CREATE POLICY "Users can update their own team" ON user_teams
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to delete their own team
CREATE POLICY "Users can delete their own team" ON user_teams
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_teams_updated_at BEFORE UPDATE ON user_teams
    FOR EACH ROW EXECUTE FUNCTION update_user_teams_updated_at();

