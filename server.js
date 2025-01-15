const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

// Création du serveur HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Écoute des connexions WebSocket
io.on('connection', (socket) => {
  console.log('Un client est connecté.');

  // Réception et rediffusion des données vidéo
  socket.on('stream', (data) => {
    socket.broadcast.emit('stream', data);
  });

  socket.on('disconnect', () => {
    console.log('Un client s\'est déconnecté.');
  });
});

// Lancer le serveur
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
