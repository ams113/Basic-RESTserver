const { response, request } = require('express');
const bcrypt = require('bcryptjs');
require('colors');
const  User = require('../models/user.schema');

const getUser = async(req = request, res = response ) => {

    // TODO: validar los parametros opcionales

    const { page = 1, limit = 10 } = req.query;
    const query = { state: true };

    /* const users = await User.find( query )
        .skip( Number( page ) )
        .limit( Number(limit) );

    const total = await User.countDocuments( query ); */

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
        .skip( Number( page ) )
        .limit( Number(limit) )
    ]);


    res.json({
        page: page,
        per_page: limit,
        total,
        users
    });
};

const postUser = async(req, res = response ) => {

    // TODO: Clean body and securize
    
    
    const { name, email, password, img, role, state, google } = req.body;
    const user = new User ( { name, email, password, role } );
    
    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync( password, salt );

    // save in DB
    await user.save();
    console.log('[Info] save: USER -> ' + user);
    res.status(201).json({
        msg: 'post API - controller Users',
        user
    });
};


const putUser = async(req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, email, ...restBody } = req.body;

    // TODO: Validate against BD

    if ( password ) {
        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        restBody.password = bcrypt.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, restBody );


    res.json({
        msg: 'put API - controller Users',
        id
    });
};

const deleteUser = async(req, res = response ) => {

    const { id } = req.params;
    // realy delete
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { state: false, updateAt: new Date() } );
    const userAuth = req.user;
    res.json({
        user
    });
};

const patchUser = (req, res = response ) => {
    res.json({
        msg: 'patch API - controller Users'
    });
};

module.exports = {
    getUser,
    postUser,
    putUser,
    patchUser,
    deleteUser
};