const { Router } = require("express");

const { check, buildCheckFunction  } = require('express-validator');
const checkParamsAndQuery = buildCheckFunction(['query', 'params']);

const { search } = require("../controllers/search.controller");
const { validateFields } = require("../middlewares");

const router = Router();

router.get('/:collection/:term', [
    check('term', 'Not is alphanumeric').isAlphanumeric(),
    checkParamsAndQuery('page', ' Invalid param').optional().isInt(),
    checkParamsAndQuery('limit', ' Invalid param').optional().isInt(),
    validateFields
], search);

module.exports = router;