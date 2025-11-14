import type { Player, TeamPosition } from '../../types';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  onAddToTeam: (playerName: string, position: TeamPosition) => Promise<void>;
  getAvailablePositions: (playerName: string) => TeamPosition[];
  loading?: boolean;
}

export function PlayerList({
  players,
  onAddToTeam,
  getAvailablePositions,
  loading,
}: PlayerListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading players...</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <p className="text-gray-600 mb-2">No players available.</p>
          <p className="text-sm text-gray-500">
            Once you set up the <code className="bg-gray-100 px-1 rounded">live_scores</code> table in Supabase and populate it with player data, players will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => (
        <PlayerCard
          key={`${player.team}-${player.player}`}
          player={player}
          onAddToTeam={onAddToTeam}
          getAvailablePositions={getAvailablePositions}
        />
      ))}
    </div>
  );
}

