const WordValidator = require('./wordValidator');

class GameManager {
  constructor() {
    this.rooms = new Map();
    this.wordValidator = new WordValidator();
  }

  addPlayer(roomId, playerId, playerName) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        players: new Map(),
        gameState: {
          isStarted: false,
          currentPlayer: '',
          letterSequence: '',
          timeLeft: 10,
          usedWords: [],
          winner: null
        },
        turnTimer: null
      });
    }

    const room = this.rooms.get(roomId);
    room.players.set(playerId, {
      id: playerId,
      name: playerName,
      lives: 3,
      isActive: true
    });
  }

  removePlayer(playerId) {
    for (const [roomId, room] of this.rooms) {
      if (room.players.has(playerId)) {
        room.players.delete(playerId);
        if (room.players.size === 0) {
          this.rooms.delete(roomId);
        }
        break;
      }
    }
  }

  getPlayers(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.players.values());
  }

  getGameState(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    return room.gameState;
  }

  startGame(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.players.size < 2) {
      return { success: false, message: 'Need at least 2 players' };
    }

    // Reset all players
    for (const player of room.players.values()) {
      player.lives = 3;
      player.isActive = true;
    }

    room.gameState = {
      isStarted: true,
      currentPlayer: Array.from(room.players.keys())[0],
      letterSequence: this.generateLetterSequence(),
      timeLeft: 10,
      usedWords: [],
      winner: null
    };

    return { success: true };
  }

  generateLetterSequence() {
    const sequences = [
      'AN', 'ER', 'IN', 'RE', 'ED', 'ND', 'OU', 'EA', 'TI', 'TO',
      'AR', 'TE', 'NG', 'AL', 'IT', 'AS', 'IS', 'HA', 'ET', 'SE',
      'ST', 'EN', 'OF', 'LE', 'SA', 'TH', 'NT', 'ON', 'AT', 'ES'
    ];
    return sequences[Math.floor(Math.random() * sequences.length)];
  }

  async submitWord(roomId, playerId, word) {
    const room = this.rooms.get(roomId);
    if (!room || !room.gameState.isStarted) {
      return { success: false, message: 'Game not started' };
    }

    if (room.gameState.currentPlayer !== playerId) {
      return { success: false, message: 'Not your turn' };
    }

    // Check if word contains the letter sequence
    if (!word.toLowerCase().includes(room.gameState.letterSequence.toLowerCase())) {
      return { success: false, message: `Word must contain "${room.gameState.letterSequence}"` };
    }

    // Check if word was already used
    if (room.gameState.usedWords.includes(word.toLowerCase())) {
      return { success: false, message: 'Word already used' };
    }

    // Check if word is valid (minimum 3 letters)
    if (word.length < 3) {
      return { success: false, message: 'Word must be at least 3 letters long' };
    }

    // Validate word with Wordnik API
    const isValidWord = await this.wordValidator.validateWord(word);
    if (!isValidWord) {
      return { success: false, message: 'Not a valid word' };
    }

    // Word is valid, add to used words and move to next player
    room.gameState.usedWords.push(word.toLowerCase());
    this.nextTurn(roomId);

    return { success: true, message: 'Correct! Well done!' };
  }

  nextTurn(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const activePlayers = Array.from(room.players.values()).filter(p => p.isActive);
    const currentIndex = activePlayers.findIndex(p => p.id === room.gameState.currentPlayer);
    const nextIndex = (currentIndex + 1) % activePlayers.length;
    
    room.gameState.currentPlayer = activePlayers[nextIndex].id;
    room.gameState.letterSequence = this.generateLetterSequence();
    room.gameState.timeLeft = 10;
  }

  startTurnTimer(roomId, callback) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // Clear existing timer
    if (room.turnTimer) {
      clearInterval(room.turnTimer);
    }

    room.turnTimer = setInterval(() => {
      room.gameState.timeLeft--;
      
      if (room.gameState.timeLeft <= 0) {
        // Time's up! Player loses a life
        const currentPlayer = room.players.get(room.gameState.currentPlayer);
        if (currentPlayer) {
          currentPlayer.lives--;
          if (currentPlayer.lives <= 0) {
            currentPlayer.isActive = false;
          }
        }
        
        // Clear current timer
        clearInterval(room.turnTimer);
        room.turnTimer = null;
        
        // Move to next player
        this.nextTurn(roomId);
        
        // Immediately start a new timer for the next player
        setTimeout(() => {
          this.startTurnTimer(roomId, callback);
        }, 100);
      }
      
      callback(room.gameState);
    }, 1000);
  }

  checkGameOver(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const activePlayers = Array.from(room.players.values()).filter(p => p.isActive);
    if (activePlayers.length <= 1) {
      if (room.turnTimer) {
        clearInterval(room.turnTimer);
        room.turnTimer = null;
      }
      return activePlayers.length === 1 ? activePlayers[0].id : null;
    }
    
    return null;
  }
}

module.exports = GameManager;