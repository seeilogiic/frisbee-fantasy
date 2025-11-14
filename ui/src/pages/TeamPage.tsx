import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { UserTeam, Player, TeamPosition } from '../types';
import { TeamView } from '../components/team/TeamView';

export function TeamPage() {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [playersData, setPlayersData] = useState<Map<string, Player>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserTeam();
    }
  }, [user]);

  useEffect(() => {
    if (userTeam) {
      fetchPlayersData();
    }
  }, [userTeam]);

  const fetchUserTeam = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_teams')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      setUserTeam(data || null);
    } catch (err) {
      setError('Failed to load team');
      console.error('Error fetching user team:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayersData = async () => {
    if (!userTeam) return;

    try {
      // Get all unique player names from the team
      const playerNames = [
        userTeam.captain,
        userTeam.handler_1,
        userTeam.handler_2,
        userTeam.cutter_1,
        userTeam.cutter_2,
        userTeam.defender_1,
        userTeam.defender_2,
      ].filter((name): name is string => name !== null);

      if (playerNames.length === 0) {
        setPlayersData(new Map());
        return;
      }

      // Fetch player data from live_scores
      const { data, error } = await supabase
        .from('live_scores')
        .select('*')
        .in('player', playerNames);

      if (error) {
        // If table doesn't exist, just set empty map (scores will show as 0)
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('live_scores table not found - scores will show as 0');
          setPlayersData(new Map());
          return;
        }
        throw error;
      }

      // Create a map for easy lookup
      const playersMap = new Map<string, Player>();
      (data || []).forEach((player) => {
        playersMap.set(player.player, player);
      });

      setPlayersData(playersMap);
    } catch (err) {
      // Silently handle errors - scores will just show as 0
      console.error('Error fetching players data:', err);
      setPlayersData(new Map());
    }
  };

  const onRemovePlayer = async (position: TeamPosition, slot?: number) => {
    if (!user || !userTeam) return;

    try {
      const updates: Partial<UserTeam> = {
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (position === 'captain') {
        updates.captain = null;
      } else if (position === 'handler') {
        if (slot === 1) {
          updates.handler_1 = null;
        } else {
          updates.handler_2 = null;
        }
      } else if (position === 'cutter') {
        if (slot === 1) {
          updates.cutter_1 = null;
        } else {
          updates.cutter_2 = null;
        }
      } else if (position === 'defender') {
        if (slot === 1) {
          updates.defender_1 = null;
        } else {
          updates.defender_2 = null;
        }
      }

      const { error } = await supabase.from('user_teams').upsert(updates, {
        onConflict: 'user_id',
      });

      if (error) throw error;

      // Refresh user team and players data
      await fetchUserTeam();
    } catch (err) {
      console.error('Error removing player from team:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Team</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}
      <TeamView
        userTeam={userTeam}
        playersData={playersData}
        onRemovePlayer={onRemovePlayer}
        loading={loading}
      />
    </div>
  );
}

