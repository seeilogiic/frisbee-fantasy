import { useState } from 'react';
import type { Player, TeamPosition } from '../../types';
import { AddPlayerModal } from './AddPlayerModal';

interface PlayerCardProps {
  player: Player;
  onAddToTeam: (playerName: string, position: TeamPosition) => Promise<void>;
  getAvailablePositions: (playerName: string) => TeamPosition[];
}

export function PlayerCard({
  player,
  onAddToTeam,
  getAvailablePositions,
}: PlayerCardProps) {
  const [showModal, setShowModal] = useState(false);

  const availablePositions = getAvailablePositions(player.player);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{player.player}</h3>
            <p className="text-sm text-gray-600">{player.team}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">${player.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <span className="text-gray-600">Assists:</span>{' '}
            <span className="font-medium text-gray-900">{player.assists}</span>
          </div>
          <div>
            <span className="text-gray-600">Goals:</span>{' '}
            <span className="font-medium text-gray-900">{player.goals}</span>
          </div>
          <div>
            <span className="text-gray-600">Ds:</span>{' '}
            <span className="font-medium text-gray-900">{player.ds}</span>
          </div>
          <div>
            <span className="text-gray-600">Turnovers:</span>{' '}
            <span className="font-medium text-gray-900">{player.turnovers}</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={availablePositions.length === 0}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Team
        </button>
      </div>
      {showModal && (
        <AddPlayerModal
          playerName={player.player}
          onClose={() => setShowModal(false)}
          onAdd={(position) => onAddToTeam(player.player, position)}
          availablePositions={availablePositions}
        />
      )}
    </>
  );
}

