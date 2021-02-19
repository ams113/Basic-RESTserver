const { Router } = require('express');
const { check, buildCheckFunction  } = require('express-validator');
const checkParamsAndQuery = buildCheckFunction(['query', 'params']);


const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { existCategoryId, existProductId } = require('../helpers/db-validators');

const { 
    getProducts,
    getProduct,
    addProduct,
    putProduct,
    deleteProduct 
} = require('../controllers/products.controller');

const router = Router();

router.get('/', [
    checkParamsAndQuery('page', 'Invalid param').optional().isInt(),
    checkParamsAndQuery('limit', 'Invalid param').optional().isInt(),
    validateFields
], getProducts);

router.get('/:id', [
    check('id', 'Not is a Mongo id').isMongoId(),
    check('id').custom( existProductId ),
    validateFields
], getProduct);

router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'Not is a Mongo id').isMongoId(),
    check('category').custom( existCategoryId ),
    check('price', 'Invalid param').optional().isDecimal(),
    // check('category', 'category is required').not().isEmpty(),
    // check('category').custom( existCategory ),
    validateFields
],
addProduct);

router.put('/:id', [
    validateJWT,
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'Not is a Mongo id').isMongoId(),
    check('category').custom( existCategoryId ),
    check('price', 'Invalid param').optional().isDecimal(),
    validateFields
], putProduct);

router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'Not is a Mongo id').isMongoId(),
    validateFields
], deleteProduct);


module.exports = router;