const { Router } = require('express');
const { check  } = require('express-validator');

const { validateFields, validateUploadFile } = require('../middlewares');
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads.controller');
const { allowCollections } = require('../helpers');

const router = Router();


router.get('/:collection/:id', [
    check('id', 'Not is a Mongo id').isMongoId(),
    check('collection').custom( c => allowCollections( c, ['users', 'products'])),
    validateFields
], showImage);

router.post('/', validateUploadFile, loadFile);

router.put('/:collection/:id', [
    validateUploadFile,
    check('id', 'Not is a Mongo id').isMongoId(),
    check('collection').custom( c => allowCollections( c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);

module.exports = router;