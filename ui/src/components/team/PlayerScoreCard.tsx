import type { Player, TeamPosition } from '../../types';

interface PlayerScoreCardProps {
  playerName: string | null;
  playerData: Player | null;
  position: TeamPosition;
  onRemove?: () => void;
}

export function PlayerScoreCard({
  playerName,
  playerData,
  position,
  onRemove,
}: PlayerScoreCardProps) {
  const getScore = (): number => {
    if (!playerData) return 0;
    switch (position) {
      case 'captain':
        return playerData.captain_score;
      case 'handler':
        return playerData.handler_score;
      case 'cutter':
        return playerData.cutter_score;
      case 'defender':
        return playerData.defender_score;
      default:
        return 0;
    }
  };

  const positionLabels: Record<TeamPosition, string> = {
    captain: 'Captain',
    handler: 'Handler',
    cutter: 'Cutter',
    defender: 'Defender',
  };

  if (!playerName) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <p className="text-gray-400">No {positionLabels[position]} selected</p>
      </div>
    );
  }

  const score = getScore();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{playerName}</h3>
          {playerData && (
            <p className="text-sm text-gray-600">{playerData.team}</p>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        )}
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-1">Score</div>
        <div className="text-2xl font-bold text-gray-900">{score.toFixed(2)}</div>
      </div>
      {playerData && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Assists:</span>{' '}
            <span className="font-medium text-gray-900">{playerData.assists}</span>
          </div>
          <div>
            <span className="text-gray-600">Goals:</span>{' '}
            <span className="font-medium text-gray-900">{playerData.goals}</span>
          </div>
          <div>
            <span className="text-gray-600">Ds:</span>{' '}
            <span className="font-medium text-gray-900">{playerData.ds}</span>
          </div>
          <div>
            <span className="text-gray-600">Turnovers:</span>{' '}
            <span className="font-medium text-gray-900">{playerData.turnovers}</span>
          </div>
        </div>
      )}
    </div>
  );
}

