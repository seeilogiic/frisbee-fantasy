import { useState } from 'react';
import type { TeamPosition } from '../../types';

interface AddPlayerModalProps {
  playerName: string;
  onClose: () => void;
  onAdd: (position: TeamPosition) => Promise<void>;
  availablePositions: TeamPosition[];
}

export function AddPlayerModal({
  playerName,
  onClose,
  onAdd,
  availablePositions,
}: AddPlayerModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<TeamPosition | null>(null);

  const handleAdd = async () => {
    if (!selectedPosition) return;
    setLoading(true);
    try {
      await onAdd(selectedPosition);
      onClose();
    } catch (error) {
      console.error('Error adding player:', error);
    } finally {
      setLoading(false);
    }
  };

  const positionLabels: Record<TeamPosition, string> = {
    captain: 'Captain',
    handler: 'Handler',
    cutter: 'Cutter',
    defender: 'Defender',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Add {playerName} to Team
        </h2>
        <p className="text-gray-600 mb-4">Select a position:</p>
        <div className="space-y-2 mb-6">
          {availablePositions.map((position) => (
            <label
              key={position}
              className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="position"
                value={position}
                checked={selectedPosition === position}
                onChange={() => setSelectedPosition(position)}
                className="mr-3"
              />
              <span className="text-gray-900">{positionLabels[position]}</span>
            </label>
          ))}
        </div>
        {availablePositions.length === 0 && (
          <p className="text-red-600 mb-4">
            All positions for this role are already filled.
          </p>
        )}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedPosition || loading || availablePositions.length === 0}
            className="px-4 py-2 text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add to Team'}
          </button>
        </div>
      </div>
    </div>
  );
}

