const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
require('colors');

const { User, Category, Product } = require("../models");

const allowCollections = [
    'categories',
    'products',
    'roles',
    'users',
];

const searchResponse = (res = response, value = null, page = null, limit = null, total= null ) => {

    if ( total ) {

        return res.status(200).json( {
            page: Number( page ),
            per_page: Number(limit),
            total,
            results: value
        });
    } else {

        return res.status(200).json( {
            results: ( value ) ?  value  : []
        });  
    }
};

const searchUsers = async( term = '', res = response, req ) => {

    try {

        const isMongoId = ObjectId.isValid( term );
        const { page = 0, limit = 10 } = req.query;

        if ( isMongoId ) {
            const user = await User.findById( term );

            searchResponse( res, user );
            
        } 

        const regexp = new RegExp( term, 'i' );

        const query = {
            $or: [{  name: regexp }, { email: regexp }],
            $and: [{ state: true }]
        };

        // const users = await User.find( query );

        const [ total, users ] = await Promise.all([
            User.countDocuments( query ),
            User.find( query )
            .skip( Number( page ) )
            .limit( Number(limit) )
        ]);

        searchResponse( res, users, page, limit, total );
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: `Boom!!!`
        });
    }
};

const searchCategories = async( term = '', res = response, req ) => {

    try {

        const isMongoId = ObjectId.isValid( term );
        const { page = 0, limit = 10 } = req.query;

        if ( isMongoId ) {

            /* const result = await Category.findById( term );
            res.json( {
                results: ( result ) ? [ result ] : []
            } ); */

            const query = { user: new ObjectId( term ), state: true };
             
            const [ byCategoryId, total, byUserId ] = await Promise.all([
                Category.findById( term )
                        .populate('user', 'name'),
                Category.countDocuments( query ),
                Category.find( query )
                        .populate('user', 'name')
                        .skip( Number( page ) )
                        .limit( Number(limit) )
            ]);
           
            ( byCategoryId ) ? searchResponse( res, [byCategoryId] ) 
                             : searchResponse( res, byUserId, page, limit, total )
        } else {

            const regexp = new RegExp( term, 'i' );

            const query = { name: regexp, state: true };

            const [ total, categories ] = await Promise.all([
                Category.countDocuments( query ),
                Category.find( query )
                .populate('user', 'name')
                .skip( Number( page ) )
                .limit( Number(limit) )
            ]);

            searchResponse( res, categories, page, limit, total );
        }

    } catch (error) {
        console.log('[Error] searchCategories '.red, error);
        return res.status(500).json({
            msg: `Boom!!!`
        });
    }
};

const searchProducts = async( term = '', res = response, req ) => {

    try {

        const isMongoId = ObjectId.isValid( term );
        const { page = 0, limit = 10 } = req.query;
    
        if ( isMongoId ) {

            const query = {
                $or: [{ user: new ObjectId( term ) },  { category: new ObjectId( term ) }],
                $and: [{ state: true }]
            };

            const [ producById, total, resultQuery ] = await Promise.all([
                Product.findById( term )
                        .populate('category', 'name')
                        .populate('user', 'name'),  
                Product.countDocuments( query ),
                Product.find( query )
                        .populate('category', 'name')
                        .populate('user', 'name')
                        .skip( Number( page ) )
                        .limit( Number(limit) )
            ]);
           
            ( producById ) ? searchResponse( res, [producById] ) 
                           : searchResponse( res, resultQuery, page, limit, total )

        } else {

            const regexp = new RegExp( term, 'i' );
    
            const query = { name: regexp, state: true };
        
            const [ total, products ] = await Promise.all([
                Product.countDocuments( query ),
                Product.find( query )
                .populate('user', 'name')
                .populate('category', 'name')
                .skip( Number( page ) )
                .limit( Number(limit) )
            ]);
        
           searchResponse( res, products, page, limit, total );
        }
    
    } catch (error) {
        console.log('[Error] searchProducts '.red, error);

        return res.status(500).json({
            msg: `Boom!!!`
        });
    }
  
};

const search = ( req, res = response ) => {

    const { collection, term } = req.params;

    if ( !allowCollections.includes( collection )) {
        return  res.status(400).json({
            msg: `Allow collections are: ${ allowCollections }`
        });
    }

    switch ( collection ) {

        case 'categories':
            searchCategories( term, res, req );
            break;

        case 'products':
            searchProducts( term, res, req );
            break;

        case 'users':
            searchUsers( term, res, req );
            break;

        default:
            res.status(500).json({
                msg: `OH! NO! I forgot to implement that search`
            });
    }

};

module.exports = {
    search,
};