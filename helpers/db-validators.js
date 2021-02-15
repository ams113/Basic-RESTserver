require('colors');
const Role = require("../models/role.schema");
const User = require('../models/user.schema');


const isValidRole = async( role = '' ) => {
    const existRole = await Role.findOne({ role });

    console.log('[Info] findOne: role -> ' + existRole);

    if (!existRole) {
        const msg ='Invalid role';
        const log ='[error] db-validator: isValidRole -> ' + msg;
        throw new Error( msg );
    }
};

const existEmail = async( email = '' ) => {

    const existEmail = await User.findOne({ email });
    console.log('[Info] findOne: email -> ' + existEmail);
   
    if ( existEmail ) {
        const msg ='Email is already registered';
        const log ='[error] db-validator: existEmail -> ' + msg;
        console.log( log.red );

        throw new  Error( msg );
    }
};

const existUserId = async( id ) => {
   
    try {
        const existId = await User.findById(id);

        console.log('[Info] findById: id -> ' + id);
    
        if ( !existId ) {
            const msg ='Invalid id';
            const log ='[error] db-validator: existUserId -> ' + msg;
            console.log( log.red );

            throw new  Error( msg );
        }
    } catch (error) {
        const err = '[error] db-validator: Invalid id -> CastIdError: ' + id;
        console.log(err.red);
        throw new Error('Invalid id');
    }
    
};


module.exports = {
    isValidRole,
    existEmail,
    existUserId,
};