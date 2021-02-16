const { Router } = require('express');
const { check, buildCheckFunction  } = require('express-validator');
const checkParamsAndQuery = buildCheckFunction(['query', 'params']);

const { isValidRole, existEmail, existUserId } = require('../helpers/db-validators');

const { validateFields, validateJWT, isAdminRole, verifyRoles } = require('../middlewares');

const { 
    getUser,
    postUser,
    putUser,
    patchUser,
    deleteUser
} = require('../controllers/users.controller');

const router = Router();


router.get('/', [
    checkParamsAndQuery('page', ' Invalid param').optional().isInt(),
    checkParamsAndQuery('limit', ' Invalid param').optional().isInt(),
    validateFields
],  getUser);

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom( existEmail ),
    check('password', 'password must be at least 6 characters long').isLength({ min: 6 }),
    // check('role', 'Invalid role').isIn( ['ADMIN_ROLE', 'USER_ROLE'] ),
    check('role').custom( isValidRole ), // (role) => isValidRole( role )
    validateFields
], postUser);

router.put('/:id', [
    check('id', 'Not is a Mongo id').isMongoId(),
    check('id').custom( existUserId ),
    check('role').custom( isValidRole ),
    validateFields
], putUser);

router.delete('/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'USER_ROLE'), // example for varius roles.
    isAdminRole,
    check('id', 'Not is a Mongo id').isMongoId(),
    check('id').custom( existUserId ),
    validateFields
],
deleteUser);

router.patch('/', patchUser);






module.exports = router;