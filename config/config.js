'use strict';

const config = {
    env: process.env.NODE_ENV,
    logger: {
        format: process.env.LOG_FORMAT || 'dev',
        enabled: process.env.DEBUG_LOG_ENABLED ? process.env.DEBUG_LOG_ENABLED.toLowerCase() === 'true' : false
    },
    server: {
        port: Number(process.env.PORT || '3000')
    },
    websocket: {
        timeInterval: 10000,
        logging: true
    },
    cookie: {
        secret: "top_secret_bottleship_cookies"
    },
    database: {
        fileLocation: __dirname + "/../database.json"
    }
};

module.exports = config;