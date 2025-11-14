export type TeamPosition = 'captain' | 'handler' | 'cutter' | 'defender';

export interface Player {
  id?: number;
  tournament_name: string;
  team: string;
  player: string;
  tournaments?: string | null;
  games?: string | null;
  assists: number;
  goals: number;
  ds: number;
  turnovers: number;
  price: number;
  games_played: number;
  captain_score: number;
  handler_score: number;
  cutter_score: number;
  defender_score: number;
  questionable: boolean;
  updated_at?: string;
}

export interface UserTeam {
  id?: string;
  user_id: string;
  captain: string | null;
  handler_1: string | null;
  handler_2: string | null;
  cutter_1: string | null;
  cutter_2: string | null;
  defender_1: string | null;
  defender_2: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

