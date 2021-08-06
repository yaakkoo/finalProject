const winston = require('winston')
require('winston-mongodb')
const url = process.env.MONGO_URL;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({
            filename: 'info.log',
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        })
        // ,
        // new winston.transports.MongoDB({
        //     level: 'info',
        //     options : {useUnifiedTopology: true},
        //     db : url
        // })
    ],
});

module.exports = logger;