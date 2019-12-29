/**
 * 
 * @param {string} port 
 * @param {string} database 
 */
function getContent(port, database) {
    return `
FROM node:10-alpine
WORKDIR /app
COPY . .
ENV PORT ${port}
ENV MONGO_URL mongodb://localhost:27017/${database}
ENV LOG_LEVEL info
RUN npm install
CMD [ "node", "app.js" ]
EXPOSE \${PORT}
`;
}


module.exports.getContent = getContent;