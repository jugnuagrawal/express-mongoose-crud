
function _getContent(_nameCamelCase, _nameKebabCase) {
    return `const router = require('express').Router();
const ${_nameCamelCase}Controller = require('./${_nameKebabCase}.controller.js');

router.use('/', ${_nameCamelCase}Controller);

module.exports = router;
`;
}


module.exports.getContent = _getContent;