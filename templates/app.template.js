/**
 * 
 * @param {string} nameKebabCase 
 * @param {string} basePath 
 * @param {string} database 
 * @param {string} port 
 */
function getContent(nameKebabCase, basePath, database, port) {
    return `const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const mongoose = require('mongoose');


const messages = require('./messages/${nameKebabCase}.messages');
const controllers = require('./controllers');

const logger = log4js.getLogger('server');
const app = express();

const PORT = process.env.PORT || ${port};
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/${database}';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

//log4js configuration
log4js.configure({
    appenders: { 'out': { type: 'stdout' }, server: { type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log', maxLogSize: 52428800, backups: 3, compress: true } },
    categories: { default: { appenders: ['out', 'server'], level: LOG_LEVEL } }
});

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//logging each request
app.use((req, res, next) => {
    logger.info(req.method, req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.path);
    // res.setHeader('Access-Control-Allow-Origin','*');
    // res.setHeader('Access-Control-Allow-Methods','*');
    // res.setHeader('Access-Control-Allow-Headers','*');
    next();
});

//checking mongodb is available
app.use((req, res, next) => {
    if (mongoose.connections.length == 0 || mongoose.connections[0].readyState != 1) {
        mongoose.connect(MONGO_URL, (err) => {
            if (err) {
                logger.error(err);
                res.status(500).json({ message: messages.error['500'] });
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

app.use('${basePath}/api', controllers);
app.get('${basePath}/', (req, res) => {
    res.status(200).json({
        message: '${nameKebabCase} is running'
    });
});

mongoose.connect(MONGO_URL, (err) => {
    if (err) {
        logger.error(err);
        process.exit(0);
    } else {
        logger.info('Connected to Database');
    }
});

app.listen(PORT, (err) => {
    if (err) {
        logger.error(err);
    } else {
        logger.info('Server started is listening on', PORT);
    }
});`;
}

module.exports.getContent = getContent;