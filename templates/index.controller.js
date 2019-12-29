/**
 * 
 * @param {string} nameCamelCase 
 * @param {string} nameKebabCase 
 */
function getContent(nameCamelCase, nameKebabCase) {
    return `const router = require('express').Router();
const ${nameCamelCase}Controller = require('./${nameKebabCase}.controller.js');

router.use('/', ${nameCamelCase}Controller);

module.exports = router;
`;
}


module.exports.getContent = getContent;