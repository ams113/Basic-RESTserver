const validatedFields = require('../middlewares/validate-fields');
const validatedJWT = require('../middlewares/validate-jwt');
const validatedRoles = require('../middlewares/validate-role');

module.exports ={
    ...validatedFields,
    ...validatedJWT,
    ...validatedRoles,
};