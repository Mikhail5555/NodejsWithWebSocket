const config = require('./config/config');
const uuid = require('uuid4');
const WebSocket = require('ws');
const WebServer = WebSocket.Server;

module.exports = (server) => {
    OnLoad(new WebServer({server}));
};

let OnLoad = (CurrentServer) => {
    let logging = config.websocket.logging;
    let onConnect = (ws, req) => {
        if (logging) console.log("A new user connected!");
        ws.isAlive = true;
        ws.clientId = uuid();
        ws.send(Date.now() + ': Hi there, wanna play a game?');

        ws.on('message', (message) => {
            if (message === "test") {
                CurrentServer.broadcast(`A new user has joined: ${ws.clientId}`);
            }
            if (logging) console.log('received: %s from Client %s', message, ws.clientId);
            // ws.send(`Hello, you sent -> ${message}`);
        });

        ws.on('close', () => {
            if (logging) console.log("Client %s closed the connection.", ws.clientId);
        });

        ws.on('pong', () => {
            ws.isAlive = true;
        });
    };

    let sendPing = (ws) => {
        if (!ws.isAlive) {
            if (logging) console.log("Terminating Client %s due to inactivity.", ws.clientId);
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    };

    let sendBroadcastToOthers = (ws, data) => {
        CurrentServer.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    };

    let sendBroadcast = (data) => {
        console.log(`Sending broadcast with following data: ${data}`);
        CurrentServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    };

    CurrentServer.on('connection', onConnect);
    CurrentServer.broadcast = sendBroadcast;

    const interval = setInterval(() => CurrentServer.clients.forEach(sendPing), config.websocket.timeInterval);
};