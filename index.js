const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const makeDir = require('make-dir');

const package = require('./templates/package.template');
const app = require('./templates/app.template');
const controller = require('./templates/controller.template');
const indexController = require('./templates/index.controller');
const messages = require('./templates/messages.template');
const docker = require('./templates/docker.template');
const readme = require('./templates/readme.template');

const logger = log4js.getLogger('express-mongoose-crud');

String.prototype.toCamelCase = function () {
    return this.split(' ').map((e, i) => i === 0 ? e.toLowerCase() : (e[0].toUpperCase() + e.substr(1, e.length))).join('');
}

String.prototype.toPascalCase = function () {
    return this.split(' ').map(e => e[0].toUpperCase() + e.substr(1, e.length)).join('');
}

String.prototype.toKebabCase = function () {
    return this.split(' ').map(e => e.toLowerCase()).join('-');
}

/**
 * 
 * @param {{name:string,database:string,basePath:string,outputPath:string,port:number,schema:any}} schema The Schema JSON
 */
function createProject(schema) {
    const nameCamelCase = schema.name.toCamelCase();
    const nameKebabCase = schema.name.toKebabCase();
    const namePascalCase = schema.name.toPascalCase();
    let basePath = schema.basePath ? schema.basePath : '';
    if (basePath && basePath != '') {
        if (!basePath.startsWith('/')) {
            basePath = '/' + basePath;
        }
    }
    let projectPath = path.join(nameKebabCase);
    // if (schema.filePath) {
    //     let segments = schema.filePath.split('/');
    //     segments.pop();
    //     segments.push(nameKebabCase);
    //     projectPath = segments.join('/');
    // }
    if (schema.outputPath) {
        let segments = schema.outputPath.split('/');
        segments.pop();
        segments.push(nameKebabCase);
        projectPath = segments.join('/');
    }
    let database = schema.database ? schema.database : nameCamelCase;
    let port = schema.port ? schema.port : 3000;
    if (!fs.existsSync(projectPath)) {
        makeDir.sync(projectPath);
    }
    if (!fs.existsSync(path.join(projectPath, 'controllers'))) {
        makeDir.sync(path.join(projectPath, 'controllers'));
    }
    if (!fs.existsSync(path.join(projectPath, 'schemas'))) {
        makeDir.sync(path.join(projectPath, 'schemas'));
    }
    if (!fs.existsSync(path.join(projectPath, 'messages'))) {
        makeDir.sync(path.join(projectPath, 'messages'));
    }

    fs.writeFileSync(path.join(projectPath, 'controllers', nameKebabCase + '.controller.js'), controller.getContent(nameCamelCase, nameKebabCase), 'utf-8');
    logger.info(nameKebabCase + '.controller.js created!');
    fs.writeFileSync(path.join(projectPath, 'controllers', 'index.js'), indexController.getContent(nameCamelCase, nameKebabCase), 'utf-8');
    logger.info('index.js created!');
    fs.writeFileSync(path.join(projectPath, 'schemas', nameKebabCase + '.schema.json'), JSON.stringify(schema.schema, null, 4), 'utf-8');
    logger.info(nameKebabCase + '.schema.json created!');
    fs.writeFileSync(path.join(projectPath, 'messages', nameKebabCase + '.messages.js'), messages.getContent(), 'utf-8');
    logger.info(nameKebabCase + '.messages.js created!');

    fs.writeFileSync(path.join(projectPath, 'app.js'), app.getContent(nameKebabCase, basePath, database, port), 'utf-8')
    logger.info('app.js created!');
    fs.writeFileSync(path.join(projectPath, 'package.json'), package.getContent(nameKebabCase), 'utf-8')
    logger.info('package.json created!');
    fs.writeFileSync(path.join(projectPath, '.gitignore'), 'node_modules\nlogs\n.vscode\npackage-lock.json', 'utf-8');
    logger.info('.gitignore created!');
    fs.writeFileSync(path.join(projectPath, 'Dockerfile'), docker.getContent(port, database), 'utf-8');
    logger.info('Dockerfile created!');
    fs.writeFileSync(path.join(projectPath, '.dockerignore'), 'node_modules\nlogs\n.vscode\npackage-lock.json', 'utf-8');
    logger.info('.dockerignore created!');
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme.getContent(nameKebabCase), 'utf-8');
    logger.info('README.md created!');
}


module.exports.createProject = createProject;