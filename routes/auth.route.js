const { Router } = require('express');
const { check  } = require('express-validator');

const { login, googleSignin, renewToken }= require('../controllers/auth.controller');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validateFields
], googleSignin);

router.get('/', validateJWT, renewToken );

module.exports = router;