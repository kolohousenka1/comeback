const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const GameManager = require('./gameManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const gameManager = new GameManager();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ roomId, playerName }) => {
    socket.join(roomId);
    gameManager.addPlayer(roomId, socket.id, playerName);
    
    const players = gameManager.getPlayers(roomId);
    io.to(roomId).emit('playersUpdate', players);
    
    const gameState = gameManager.getGameState(roomId);
    socket.emit('gameStateUpdate', gameState);
  });

  socket.on('startGame', (roomId) => {
    const result = gameManager.startGame(roomId);
    if (result.success) {
      const gameState = gameManager.getGameState(roomId);
      io.to(roomId).emit('gameStateUpdate', gameState);
      
      // Start the turn timer
      gameManager.startTurnTimer(roomId, (updatedGameState) => {
        io.to(roomId).emit('gameStateUpdate', updatedGameState);
        
        const players = gameManager.getPlayers(roomId);
        io.to(roomId).emit('playersUpdate', players);
        
        // Check for game over
        const winner = gameManager.checkGameOver(roomId);
        if (winner) {
          io.to(roomId).emit('gameOver', { winner });
        }
      });
    }
  });

  socket.on('submitWord', async ({ roomId, word }) => {
    const result = await gameManager.submitWord(roomId, socket.id, word);
    
    socket.emit('wordResult', {
      success: result.success,
      message: result.message
    });
    
    if (result.success) {
      // Clear any existing timer first
      const room = gameManager.rooms.get(roomId);
      if (room && room.turnTimer) {
        clearInterval(room.turnTimer);
        room.turnTimer = null;
      }
      
      const gameState = gameManager.getGameState(roomId);
      io.to(roomId).emit('gameStateUpdate', gameState);
      
      // Start next turn timer
      gameManager.startTurnTimer(roomId, (updatedGameState) => {
        io.to(roomId).emit('gameStateUpdate', updatedGameState);
        
        const players = gameManager.getPlayers(roomId);
        io.to(roomId).emit('playersUpdate', players);
        
        // Check for game over
        const winner = gameManager.checkGameOver(roomId);
        if (winner) {
          io.to(roomId).emit('gameOver', { winner });
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameManager.removePlayer(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});