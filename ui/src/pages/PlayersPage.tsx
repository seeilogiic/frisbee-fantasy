import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Player, TeamPosition, UserTeam } from '../types';
import { PlayerList } from '../components/players/PlayerList';

export function PlayersPage() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
    fetchUserTeam();
  }, [user]);

  const fetchPlayers = async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please set up your environment variables.');
      setPlayers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('live_scores')
        .select('*')
        .order('player');

      if (error) {
        // Check if table doesn't exist (42P01) or relation doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation') || error.message?.includes('permission denied')) {
          setError('Player data table not found or not accessible. Please set up the live_scores table in Supabase.');
          setPlayers([]);
        } else {
          throw error;
        }
      } else {
        setPlayers(data || []);
        setError(null);
      }
    } catch (err: any) {
      // Handle other errors
      if (err?.code === '42P01' || err?.message?.includes('does not exist') || err?.message?.includes('relation')) {
        setError('Player data table not found. Please set up the live_scores table in Supabase.');
      } else if (err?.message?.includes('JWT') || err?.message?.includes('Invalid API key')) {
        setError('Invalid Supabase credentials. Please check your environment variables.');
      } else {
        setError('Failed to load players. Please check your Supabase connection and configuration.');
      }
      setPlayers([]);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeam = async () => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('user_teams')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is fine
        // If table doesn't exist, that's also fine - user just hasn't created a team yet
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('user_teams table not found - user can still create a team');
          setUserTeam(null);
        } else {
          throw error;
        }
      } else {
        setUserTeam(data || null);
      }
    } catch (err) {
      console.error('Error fetching user team:', err);
      // Don't set error state here - team not existing is fine
    }
  };

  const getAvailablePositions = (playerName: string): TeamPosition[] => {
    if (!userTeam) {
      return ['captain', 'handler', 'cutter', 'defender'];
    }

    const available: TeamPosition[] = [];

    // Check captain
    if (!userTeam.captain || userTeam.captain === playerName) {
      available.push('captain');
    }

    // Check handlers
    const handlerCount = [userTeam.handler_1, userTeam.handler_2].filter(
      (h) => h && h !== playerName
    ).length;
    if (handlerCount < 2) {
      available.push('handler');
    }

    // Check cutters
    const cutterCount = [userTeam.cutter_1, userTeam.cutter_2].filter(
      (c) => c && c !== playerName
    ).length;
    if (cutterCount < 2) {
      available.push('cutter');
    }

    // Check defenders
    const defenderCount = [userTeam.defender_1, userTeam.defender_2].filter(
      (d) => d && d !== playerName
    ).length;
    if (defenderCount < 2) {
      available.push('defender');
    }

    return available;
  };

  const onAddToTeam = async (playerName: string, position: TeamPosition) => {
    if (!user) return;

    try {
      const updates: Partial<UserTeam> = {
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      // Determine which field to update based on position
      if (position === 'captain') {
        updates.captain = playerName;
      } else if (position === 'handler') {
        if (!userTeam?.handler_1) {
          updates.handler_1 = playerName;
        } else {
          updates.handler_2 = playerName;
        }
      } else if (position === 'cutter') {
        if (!userTeam?.cutter_1) {
          updates.cutter_1 = playerName;
        } else {
          updates.cutter_2 = playerName;
        }
      } else if (position === 'defender') {
        if (!userTeam?.defender_1) {
          updates.defender_1 = playerName;
        } else {
          updates.defender_2 = playerName;
        }
      }

      // Remove player from other positions if they're already in the team
      if (userTeam) {
        if (userTeam.captain === playerName && position !== 'captain') {
          updates.captain = null;
        }
        if (userTeam.handler_1 === playerName && position !== 'handler') {
          updates.handler_1 = null;
        }
        if (userTeam.handler_2 === playerName && position !== 'handler') {
          updates.handler_2 = null;
        }
        if (userTeam.cutter_1 === playerName && position !== 'cutter') {
          updates.cutter_1 = null;
        }
        if (userTeam.cutter_2 === playerName && position !== 'cutter') {
          updates.cutter_2 = null;
        }
        if (userTeam.defender_1 === playerName && position !== 'defender') {
          updates.defender_1 = null;
        }
        if (userTeam.defender_2 === playerName && position !== 'defender') {
          updates.defender_2 = null;
        }
      }

      const { error } = await supabase.from('user_teams').upsert(updates, {
        onConflict: 'user_id',
      });

      if (error) throw error;

      // Refresh user team
      await fetchUserTeam();
    } catch (err) {
      console.error('Error adding player to team:', err);
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Players</h1>
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">{error}</p>
              <p className="mt-2 text-sm text-yellow-700">
                The app will work once you set up the <code className="bg-yellow-100 px-1 rounded">live_scores</code> table in Supabase. 
                You can still create and manage your team, but player data won't be available until the table is set up.
              </p>
            </div>
          </div>
        </div>
      )}
      <PlayerList
        players={players}
        onAddToTeam={onAddToTeam}
        getAvailablePositions={getAvailablePositions}
        loading={loading}
      />
    </div>
  );
}

