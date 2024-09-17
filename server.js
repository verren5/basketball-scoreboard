const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = https.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for your HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/display.html'));
});

app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/control.html'));
});

// WebSocket server
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Broadcast received message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
