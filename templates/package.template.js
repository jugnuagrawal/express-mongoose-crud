const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_nameKebabCase) {
  return `{
  "name": "${_nameKebabCase}",
  "version": "1.0.0",
  "description": "An express mongoose CRUD API",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "keywords": [
    "CRUD",
    "Express",
    "Mongoose",
    "REST"
  ],
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "log4js": "^6.1.0",
    "mongoose": "^5.8.3"
  },
  "author": "Jugnu Agrawal",
  "license": "ISC"
}
`;
}