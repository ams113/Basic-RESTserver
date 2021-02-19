require('colors');
const { Category, Product } = require('../models');
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

        console.log('[Info] findById: User id -> ' + id);
    
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

const existCategoryId = async( id ) => {
   
    try {
        const existId = await Category.findById(id);

        console.log('[Info] findById: category id -> ' + id);
    
        if ( !existId ) {
            const msg ='Invalid id';
            const log ='[error] db-validator: existCategoryId -> ' + msg;
            console.log( log.red );

            throw new  Error( msg );
        }
    } catch (error) {
        const err = '[error] db-validator: Invalid id -> CastIdError: ' + id;
        console.log(err.red);
        throw new Error('Invalid id');
    }
    
};

const existCategory = async( name ) => {
   
    console.log( '------------------------------------------------------'.red );
    
    const exist = await Category.findOne( { name } );

    console.log(`[Info] findOne: category ${ name } -> ${ exist }`);

    if ( !exist ) {
        const msg ='Invalid category';
        const log ='[error] db-validator: existCategory -> ' + msg;
        console.log( log.red );

        throw new  Error( msg );
    }
};

const existProductId = async( id ) => {
   
    try {
        const existId = await Product.findById(id);

        console.log('[Info] findById: Product id -> ' + id);
    
        if ( !existId ) {
            const msg ='Invalid id';
            const log ='[error] db-validator: existProductId -> ' + msg;
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
    existCategoryId,
    existCategory,
    existProductId
};