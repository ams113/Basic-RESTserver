const validatedFields       = require('../middlewares/validate-fields');
const validatedJWT          = require('../middlewares/validate-jwt');
const validatedRoles        = require('../middlewares/validate-role');
const validateFile    = require('../middlewares/validate-file');

module.exports = {
    ...validatedFields,
    ...validatedJWT,
    ...validatedRoles,
    ...validateFile,
};