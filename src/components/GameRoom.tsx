'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import PlayerList from './PlayerList';
import GameTimer from './GameTimer';
import WordInput from './WordInput';

interface Player {
  id: string;
  name: string;
  lives: number;
  isActive: boolean;
}

interface GameState {
  isStarted: boolean;
  currentPlayer: string;
  letterSequence: string;
  timeLeft: number;
  usedWords: string[];
  winner: string | null;
}

interface GameRoomProps {
  roomId: string;
  playerName: string;
}

export default function GameRoom({ roomId, playerName }: GameRoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isStarted: false,
    currentPlayer: '',
    letterSequence: '',
    timeLeft: 10,
    usedWords: [],
    winner: null
  });
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('joinRoom', { roomId, playerName });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('playersUpdate', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    newSocket.on('gameStateUpdate', (updatedGameState: GameState) => {
      setGameState(updatedGameState);
    });

    newSocket.on('wordResult', ({ success, message: msg }: { success: boolean; message: string }) => {
      setMessage(msg);
      if (success) {
        setCurrentWord('');
      }
      setTimeout(() => setMessage(''), 3000);
    });

    newSocket.on('gameOver', ({ winner }: { winner: string }) => {
      setGameState(prev => ({ ...prev, winner, isStarted: false }));
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, playerName]);

  const startGame = () => {
    if (socket) {
      socket.emit('startGame', roomId);
    }
  };

  const submitWord = () => {
    if (socket && currentWord.trim()) {
      socket.emit('submitWord', { roomId, word: currentWord.trim().toLowerCase() });
    }
  };

  const currentPlayerData = players.find(p => p.id === socket?.id);
  const isCurrentTurn = gameState.currentPlayer === socket?.id;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to game server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">💣 Word Bomb</h1>
              <p className="text-gray-600">Room: {roomId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Players: {players.length}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Players List */}
          <div className="lg:col-span-1">
            <PlayerList players={players} currentPlayerId={gameState.currentPlayer} />
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {!gameState.isStarted && !gameState.winner ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Waiting for Game to Start</h2>
                <p className="text-gray-600 mb-6">Need at least 2 players to begin</p>
                {players.length >= 2 && (
                  <button
                    onClick={startGame}
                    className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Start Game
                  </button>
                )}
              </div>
            ) : gameState.winner ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Game Over!</h2>
                <p className="text-xl text-gray-600 mb-6">
                  {players.find(p => p.id === gameState.winner)?.name} wins!
                </p>
                <button
                  onClick={startGame}
                  className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <>
                {/* Game Timer and Letter Sequence */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-purple-600 mb-4">
                      {gameState.letterSequence}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Form a word containing these letters
                    </p>
                    <GameTimer timeLeft={gameState.timeLeft} />
                  </div>
                </div>

                {/* Current Turn Indicator */}
                <div className={`rounded-2xl shadow-2xl p-6 ${
                  isCurrentTurn ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'
                }`}>
                  <div className="text-center">
                    {isCurrentTurn ? (
                      <>
                        <h3 className="text-xl font-bold text-green-800 mb-4">🎯 Your Turn!</h3>
                        <WordInput
                          value={currentWord}
                          onChange={setCurrentWord}
                          onSubmit={submitWord}
                          disabled={!isCurrentTurn}
                          letterSequence={gameState.letterSequence}
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">⏳ Waiting...</h3>
                        <p className="text-gray-500">
                          {players.find(p => p.id === gameState.currentPlayer)?.name}'s turn
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Message Display */}
                {message && (
                  <div className={`rounded-2xl shadow-2xl p-4 text-center ${
                    message.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Used Words */}
                {gameState.usedWords.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Used Words:</h3>
                    <div className="flex flex-wrap gap-2">
                      {gameState.usedWords.map((word, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}