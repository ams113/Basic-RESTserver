const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
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

const verifyJWT = async( token = '') => {

    try {

        if ( token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRET );

        const user = await User.findById( uid );

        if ( user ) {
            if ( user.state ) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
        
    } catch (error) {
        return null;
    }
};


module.exports = {
    generateJWT,
    verifyJWT
};