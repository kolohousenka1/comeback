interface Player {
  id: string;
  name: string;
  lives: number;
  isActive: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
}

export default function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Players</h2>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              player.id === currentPlayerId
                ? 'border-green-500 bg-green-50'
                : player.isActive
                ? 'border-gray-200 bg-gray-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`font-semibold ${
                  player.isActive ? 'text-gray-800' : 'text-red-600'
                }`}>
                  {player.name}
                  {player.id === currentPlayerId && ' 👑'}
                </h3>
                <p className="text-sm text-gray-500">
                  {player.isActive ? 'Active' : 'Eliminated'}
                </p>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <span
                    key={i}
                    className="text-lg"
                  >
                    {i < player.lives ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}