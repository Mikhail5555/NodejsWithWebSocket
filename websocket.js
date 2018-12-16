const config = require('./config/config');
const uuid = require('uuid4');
const WebSocket = require('ws');
const WebServer = WebSocket.Server;
const Cookie = require('cookie');
const Database = require('./database');

module.exports = (server) => {
    OnLoad(new WebServer({server}));
};

let OnLoad = (CurrentServer) => {
    let logging = config.websocket.logging;

    function processMessage(ws, message) {
        let payload = JSON.parse(message);

        if (payload.messageType) {
            if (payload.messageType === "connect") {
                Database.addUser(ws.clientId, ws);
                if (logging) console.log('Connected: %s from Client %s', message, ws.clientId);
            }
        } else {
            console.error("No message type set for socket message: " + message);
        }

    }

    let onConnect = (ws, req) => {

        let reqCookie = Cookie.parse(req.headers.cookie);

        if(reqCookie.userId) {
            ws.clientId = reqCookie.userId;
        } else {
            ws.clientId = uuid();
        }

        ws.isAlive = true;

        ws.on('message', (message) => {
            processMessage(ws, message);

            if (message === "test") {
                CurrentServer.broadcast(`A new user has joined: ${ws.clientId}`);
            }
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