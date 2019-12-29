const path = require('path');
const fs = require('fs');
const package = require('./templates/package.template');
const app = require('./templates/app.template');
const controller = require('./templates/controller.template');
const indexController = require('./templates/index.controller');
const messages = require('./templates/messages.template');
const docker = require('./templates/docker.template');
const readme = require('./templates/readme.template');

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
 * @param {any} schema The Schema JSON
 */
function createProject(schema) {
    var nameCamelCase = schema.name.toCamelCase();
    var nameKebabCase = schema.name.toKebabCase();
    var namePascalCase = schema.name.toPascalCase();
    var basePath = schema.basePath ? schema.basePath : '';
    if (basePath && basePath != '') {
        if (!basePath.startsWith('/')) {
            basePath = '/' + basePath;
        }
    }
    var projectPath = path.join(nameKebabCase);
    if (schema.filePath) {
        var segments = schema.filePath.split('/');
        segments.pop();
        segments.push(nameKebabCase);
        projectPath = segments.join('/');
    }
    var schemabase = schema.database ? schema.database : nameCamelCase;
    var _port = schema.port ? schema.port : 3000;
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    if (!fs.existsSync(path.join(projectPath, 'controllers'))) {
        fs.mkdirSync(path.join(projectPath, 'controllers'));
    }
    if (!fs.existsSync(path.join(projectPath, 'schemas'))) {
        fs.mkdirSync(path.join(projectPath, 'schemas'));
    }
    if (!fs.existsSync(path.join(projectPath, 'messages'))) {
        fs.mkdirSync(path.join(projectPath, 'messages'));
    }

    fs.writeFileSync(path.join(projectPath, 'controllers', nameKebabCase + '.controller.js'), controller.getContent(nameCamelCase, nameKebabCase), 'utf-8');
    console.log(nameKebabCase + '.controller.js created!');
    fs.writeFileSync(path.join(projectPath, 'controllers', 'index.js'), indexController.getContent(nameCamelCase, nameKebabCase), 'utf-8');
    console.log('index.js created!');
    fs.writeFileSync(path.join(projectPath, 'schemas', nameKebabCase + '.schema.json'), JSON.stringify(schema.schema, null, 4), 'utf-8');
    console.log(nameKebabCase + '.schema.json created!');
    fs.writeFileSync(path.join(projectPath, 'messages', nameKebabCase + '.messages.js'), messages.getContent(), 'utf-8');
    console.log(nameKebabCase + '.messages.js created!');

    fs.writeFileSync(path.join(projectPath, 'app.js'), app.getContent(nameKebabCase, basePath, schemabase, _port), 'utf-8')
    console.log('app.js created!');
    fs.writeFileSync(path.join(projectPath, 'package.json'), package.getContent(nameKebabCase), 'utf-8')
    console.log('package.json created!');
    fs.writeFileSync(path.join(projectPath, '.gitignore'), 'node_modules\nlogs\n.vscode\npackage-lock.json', 'utf-8');
    console.log('.gitignore created!');
    fs.writeFileSync(path.join(projectPath, 'Dockerfile'), docker.getContent(_port, schemabase), 'utf-8');
    console.log('Dockerfile created!');
    fs.writeFileSync(path.join(projectPath, '.dockerignore'), 'node_modules\nlogs\n.vscode\npackage-lock.json', 'utf-8');
    console.log('.dockerignore created!');
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme.getContent(nameKebabCase), 'utf-8');
    console.log('README.md created!');
}


module.exports.createProject = createProject;