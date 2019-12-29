const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_nameCamelCase, _nameKebabCase) {
    return `const router = require('express').Router();
const mongoose = require('mongoose');
const log4js = require('log4js');
const schemaJSON = require('../schemas/${_nameKebabCase}.schema');
const messages = require('../messages/${_nameKebabCase}.messages');

const schema = new mongoose.Schema(schemaJSON);
schema.index('_id');
const logger = log4js.getLogger('${_nameKebabCase}.controller');
const model = mongoose.model('${_nameCamelCase}', schema, '${_nameCamelCase}');

router.get('/', (req, res) => {
    async function execute() {
        var query = null;
        var skip = 0;
        var count = 10;
        var filter = {};
        if (req.query.count && (+req.query.count) > 0) {
            count = +req.query.count;
        }
        if (req.query.page && (+req.query.page) > 0) {
            skip = count * ((+req.query.page) - 1);
        }
        if (req.query.filter) {
            try {
                filter = JSON.parse(req.query.filter);
            } catch (err) {
                filter = {};
                logger.error(err);
            }
        }
        if (req.query.countOnly) {
            query = model.countDocuments(filter);
        } else {
            query = model.find(filter);
            query.skip(skip);
            query.limit(count);
        }
        if (!req.query.countOnly) {
            if (req.query.select) {
                query.select(req.query.select.split(',').join(' '));
            }
            if (req.query.sort) {
                query.sort(req.query.sort.split(',').join(' '))
            }
        }
        const data = await query.exec();
        if (req.params.id && req.params.id && !data) {
            res.status(404).json({ message: messages.get['404'] });
        } else {
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
});

router.get('/:id', (req, res) => {
    async function execute() {
        var query = null;
        query = model.findById(req.params.id);
        if (req.query.select) {
            query.select(req.query.select.split(',').join(' '));
        }
        const data = await query.exec();
        if (req.params.id && req.params.id && !data) {
            res.status(404).json({ message: messages.get['404'] });
        } else {
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
});

router.post('/', (req, res) => {
    async function execute() {
        const data = await model.create(req.body);
        res.status(200).json(data);
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
});

router.put('/:id', (req, res) => {
    async function execute() {
        if (!req.params.id) {
            res.status(400).json({ message: messages.put['400'] });
            return;
        }
        const doc = await model.findById(req.params.id)
        if (!doc) {
            res.status(404).json({ message: messages.put['404'] });
        } else {
            doc.set(req.body);
            const data = await doc.save();
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
});

router.delete('/:id', (req, res) => {
    async function execute() {
        if (!req.params.id) {
            res.status(400).json({ message: messages.delete['400'] });
            return;
        }
        const doc = await model.findById(req.params.id)
        if (!doc) {
            res.status(404).json({ message: messages.delete['404'] });
        } else {
            const data = await doc.remove();
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
});

module.exports = router;`
}
