const { response, request } = require('express');
require('colors');

const { Category } = require('../models');

// pagination - total - populate
const getCategories = async(req = request, res = response ) => {

    const { page = 0, limit = 10 } = req.query;
    const query = { state: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
        .populate('user', 'name')
        .skip( Number( page ) )
        .limit( Number(limit) )
    ]);


    res.json({
        page: page,
        per_page: limit,
        total,
        categories
    });
};

// populate 
const getCategory = async(req = request, res = response ) => {

    const { id } = req.params;
    const category = await Category.findById( id )
                                    .populate('user', 'name');

    res.json( category );
};

const addCategory = async(req = request, res = response ) => {

    try {
        const name = req.body.name.toUpperCase();

        const categoryDB = await Category.findOne( { name } );
        console.log('[Info] CategoriesController: addCategory findOne-> ', categoryDB);

        if ( categoryDB ) {
            console.log(`[Error] CategoriesController: addCategory -> ${ categoryDB.name } already exists`.red);
            return res.status(400).json({
                msg: `The category ${ categoryDB.name } already exists`
            });
        }

        console.log('USER: ', req.user);

        const data = {
            name,
            user : req.user._id
        };

        const category = new Category( data );

        // save db
        await category.save();

        res.status(201).json( category );

    } catch (error) {
        console.log('[Error] CategoriesController: addCategory -> '.red + error);
        return res.status(500).json({
            msg: 'Boom!!!'
        });
    }

};

const putCategory = async(req = request, res = response ) => {

    const { id } = req.params;

    const { state, user, ...rest } = req.body;

    rest.name = rest.name.toUpperCase();
    rest.user  = req.user._id; 
    rest.updateAt = new Date();

    const category = await Category.findByIdAndUpdate( id, rest, { new: true } );
    res.json( category );
};

const deleteCategory = async(req = request, res = response ) => {
    
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( 
                        id, 
                        { state: false, updateAt: new Date() },
                        { new: true } );
                        
    const userAuth = req.user;

    res.json({
        category,
        DeletedBy: userAuth
    });
};

module.exports = {
    getCategories,
    getCategory,
    addCategory,
    putCategory,
    deleteCategory
};