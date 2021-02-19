const { Router } = require('express');
const { check, buildCheckFunction  } = require('express-validator');
const checkParamsAndQuery = buildCheckFunction(['query', 'params']);


const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { existCategoryId } = require('../helpers/db-validators');

const { 
    getCategories,
    getCategory,
    addCategory,
    putCategory,
    deleteCategory 
} = require('../controllers/categories.controller');

const router = Router();

router.get('/', [
    checkParamsAndQuery('page', ' Invalid param').optional().isInt(),
    checkParamsAndQuery('limit', ' Invalid param').optional().isInt(),
    validateFields
], getCategories);

router.get('/:id', [
    check('id', 'Not is a Mongo id').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields
], getCategory);

router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
],
addCategory);

router.put('/:id', [
    validateJWT,
    check('id', 'Not is a Mongo id').isMongoId(),
    check('id').custom( existCategoryId ),
    check('name', 'name is required').not().isEmpty(),
    validateFields
], putCategory);

router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'Not is a Mongo id').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields
], deleteCategory);


module.exports = router;