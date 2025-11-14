import type { UserTeam, Player, TeamPosition } from '../../types';
import { PlayerScoreCard } from './PlayerScoreCard';

interface TeamViewProps {
  userTeam: UserTeam | null;
  playersData: Map<string, Player>;
  onRemovePlayer: (position: TeamPosition, slot?: number) => Promise<void>;
  loading?: boolean;
}

export function TeamView({
  userTeam,
  playersData,
  onRemovePlayer,
  loading,
}: TeamViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading team...</div>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No team selected yet. Go to Players to add players to your team.</p>
      </div>
    );
  }

  const getTotalScore = (): number => {
    let total = 0;
    if (userTeam.captain) {
      const player = playersData.get(userTeam.captain);
      if (player) total += player.captain_score;
    }
    if (userTeam.handler_1) {
      const player = playersData.get(userTeam.handler_1);
      if (player) total += player.handler_score;
    }
    if (userTeam.handler_2) {
      const player = playersData.get(userTeam.handler_2);
      if (player) total += player.handler_score;
    }
    if (userTeam.cutter_1) {
      const player = playersData.get(userTeam.cutter_1);
      if (player) total += player.cutter_score;
    }
    if (userTeam.cutter_2) {
      const player = playersData.get(userTeam.cutter_2);
      if (player) total += player.cutter_score;
    }
    if (userTeam.defender_1) {
      const player = playersData.get(userTeam.defender_1);
      if (player) total += player.defender_score;
    }
    if (userTeam.defender_2) {
      const player = playersData.get(userTeam.defender_2);
      if (player) total += player.defender_score;
    }
    return total;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Total Team Score</h2>
          <div className="text-3xl font-bold text-gray-900">
            {getTotalScore().toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Captain</h3>
        <PlayerScoreCard
          playerName={userTeam.captain}
          playerData={userTeam.captain ? playersData.get(userTeam.captain) || null : null}
          position="captain"
          onRemove={userTeam.captain ? () => onRemovePlayer('captain') : undefined}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Handlers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayerScoreCard
            playerName={userTeam.handler_1}
            playerData={userTeam.handler_1 ? playersData.get(userTeam.handler_1) || null : null}
            position="handler"
            onRemove={userTeam.handler_1 ? () => onRemovePlayer('handler', 1) : undefined}
          />
          <PlayerScoreCard
            playerName={userTeam.handler_2}
            playerData={userTeam.handler_2 ? playersData.get(userTeam.handler_2) || null : null}
            position="handler"
            onRemove={userTeam.handler_2 ? () => onRemovePlayer('handler', 2) : undefined}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cutters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayerScoreCard
            playerName={userTeam.cutter_1}
            playerData={userTeam.cutter_1 ? playersData.get(userTeam.cutter_1) || null : null}
            position="cutter"
            onRemove={userTeam.cutter_1 ? () => onRemovePlayer('cutter', 1) : undefined}
          />
          <PlayerScoreCard
            playerName={userTeam.cutter_2}
            playerData={userTeam.cutter_2 ? playersData.get(userTeam.cutter_2) || null : null}
            position="cutter"
            onRemove={userTeam.cutter_2 ? () => onRemovePlayer('cutter', 2) : undefined}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Defenders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayerScoreCard
            playerName={userTeam.defender_1}
            playerData={userTeam.defender_1 ? playersData.get(userTeam.defender_1) || null : null}
            position="defender"
            onRemove={userTeam.defender_1 ? () => onRemovePlayer('defender', 1) : undefined}
          />
          <PlayerScoreCard
            playerName={userTeam.defender_2}
            playerData={userTeam.defender_2 ? playersData.get(userTeam.defender_2) || null : null}
            position="defender"
            onRemove={userTeam.defender_2 ? () => onRemovePlayer('defender', 2) : undefined}
          />
        </div>
      </div>
    </div>
  );
}

