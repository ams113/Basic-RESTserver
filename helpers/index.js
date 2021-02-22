const dbValidators  = require('./db-validators');
const googleVerify  = require('./google-verify');
const jwt           = require('./jwt');
const uploadFile    = require('./upload-file');

module.exports = {
    ...dbValidators,
    ...googleVerify,
    ...jwt,
    ...uploadFile,
};