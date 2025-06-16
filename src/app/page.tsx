'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const createRoom = () => {
    if (!playerName.trim()) return;
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${newRoomId}?name=${encodeURIComponent(playerName)}`);
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    router.push(`/room/${roomId.toUpperCase()}?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💣 Word Bomb</h1>
          <p className="text-gray-600">Fast-paced multiplayer word game</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={createRoom}
              disabled={!playerName.trim()}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create New Room
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Room ID"
                maxLength={6}
              />
              <button
                onClick={joinRoom}
                disabled={!playerName.trim() || !roomId.trim()}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🎯 Form words with given letters</p>
          <p>⏰ 10 seconds per turn</p>
          <p>❤️ 3 lives to survive</p>
        </div>
      </div>
    </div>
  );
}
