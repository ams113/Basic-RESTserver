const jwt = require('jsonwebtoken');
require('colors');


const generateJWT = ( uid = '') => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid };
        
        jwt.sign( payload, process.env.SECRET, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                // console.log( '[error]  JWT: generateJWT -> False');
                console.log(err);
                reject('Could not generate the token');
            } else {
                resolve( token );
            }

        });
    });

};

module.exports = {
    generateJWT,
};