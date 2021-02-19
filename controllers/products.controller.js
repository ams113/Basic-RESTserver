const { response, request } = require('express');
require('colors');

const { Product, Category } = require('../models');

// pagination - total - populate
const getProducts= async(req = request, res = response ) => {

    const { page = 0, limit = 10 } = req.query;
    const query = { state: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
        .populate('user', 'name')
        .populate('category', 'name')
        .skip( Number( page ) )
        .limit( Number(limit) )
    ]);


    res.json({
        page: page,
        per_page: limit,
        total,
        products
    });
};

// populate 
const getProduct = async(req = request, res = response ) => {

    const { id } = req.params;
    const product = await Product.findById( id )
                                .populate('user', 'name')
                                .populate('category', 'name');

    res.json( product );
};

const addProduct= async(req = request, res = response ) => {

    try {


        const { state, user, ...body } = req.body;
        // const nameCategory = req.body.category.toUpperCase();
        
        const name = body.name.toUpperCase();

        const productDB = await Product.findOne( { name } );
        console.log('[Info] ProductsController: addProduct findOne-> ', productDB);

        if ( productDB ) {

            console.log(`[Error] ProductsController: addProduct -> ${ productDB.name } already exists`.red);

            return res.status(400).json({
                msg: `The product ${ productDB.name } already exists`
            });
        }
/* 
        const categoryDB = await Category.findOne( { name: nameCategory } );
        console.log('[Info] ProductsController: addProduct findOne Category-> ', categoryDB);

        if ( !categoryDB ) {
            console.log(`[Error] ProductsController: addProduct -> ${ nameCategory } not exists`.red);
            return res.status(400).json({
                msg: `The category ${ nameCategory } not exists`
            });
        }

 */
        const data = {
            ...body,
            name,
            user : req.user._id,
            // category: categoryDB._id
        };

        const product = new Product( data );

        // save db
        await product.save();

        res.status(201).json( product );

    } catch (error) {
        console.log('[Error] ProductsController: addProduct -> '.red + error);
        return res.status(500).json({
            msg: 'Boom!!!'
        });
    }

};

const putProduct = async(req = request, res = response ) => {

    const { id } = req.params;

    const { state, user, ...rest } = req.body;

    if ( rest.name ) {
        rest.name = rest.name.toUpperCase();
    }

    rest.user  = req.user._id; 
    rest.updateAt = new Date();

    const product = await Product.findByIdAndUpdate( id, rest, { new: true } );
    res.json( product );
};

const deleteProduct = async(req = request, res = response ) => {
    
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( 
                        id, 
                        { state: false, updateAt: new Date() },
                        { new: true } );

    const userAuth = req.user;
    
    res.json({
        product,
        DeletedBy: userAuth
        
    });
};

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    putProduct,
    deleteProduct
};