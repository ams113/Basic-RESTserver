const { response } = require("express");
const fs = require("fs");
const path = require('path');

const  cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

require('colors');

const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");


const loadFile = async (req, res = response) => {


    try {
        const validExt = process.env.ALLOWED_EXTENSIONS.split(',');
        const name = await uploadFile(req.files, !validExt || undefined, 'bucket');
        res.json({ name });

    } catch (msg) {
        console.log(msg.red);
        res.status(400).json({ msg });
    }


};

const updateImage = async (req, res = response) => {


    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);

            if (!model) {
                res.status(400).json({ msg: 'Invalid user id' });
            }

            break;

        case 'products':

            model = await Product.findById(id);

            if (!model) {
                res.status(400).json({ msg: 'Invalid product id' });
            }

            break;

        default:
            return res.status(500).json({ msg: 'BOOM!!!' });
    }


    try {

        if ( model.img ) {
            // Delete img stored
            const pathImg = path.join( __dirname, '../uploads', collection, model.img );

            if( fs.existsSync( pathImg ) ){
                fs.unlinkSync( pathImg );
            }
        }

        const validExt = process.env.ALLOWED_EXTENSIONS.split(',');
        const name = await uploadFile(req.files, !validExt || undefined, collection);

        model.img = name;
        model.updateAt = new Date();

        await model.save();

        res.json( model );

    } catch (msg) {
        console.log(msg.red);
        res.status(400).json({ msg });
    }

};

const updateImageCloudinary = async (req, res = response) => {


    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);

            if (!model) {
                res.status(400).json({ msg: 'Invalid user id' });
            }

            break;

        case 'products':

            model = await Product.findById(id);

            if (!model) {
                res.status(400).json({ msg: 'Invalid product id' });
            }

            break;

        default:
            return res.status(500).json({ msg: 'BOOM!!!' });
    }


    try {

        if ( model.img ) {
            const splitPathImg  = model.img.split('/');
            const nameImg       = splitPathImg[ splitPathImg.length - 1 ];
            const [ id_public ] = nameImg.split('.');

            cloudinary.uploader.destroy( id_public );
        }

        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        model.img = secure_url;
        model.updateAt = new Date();

        await model.save();

        res.json( model );

    } catch (msg) {
        console.log(msg.red);
        res.status(400).json({ msg });
    }

};

const showImage = async(req, res = response) => {
    
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);

            if (!model) {
                res.status(400).json({ msg: 'Invalid user id' });
            }

            break;

        case 'products':

            model = await Product.findById(id);

            if (!model) {
                res.status(400).json({ msg: 'Invalid product id' });
            }

            break;

        default:
            return res.status(500).json({ msg: 'BOOM!!!' });
    }


    try {

        if ( model.img ) {
            // Delete img stored
            const pathImg = path.join( __dirname, '../uploads', collection, model.img );

            if( fs.existsSync( pathImg ) ){
                return res.sendFile( pathImg );
            }
        }

        const pathImg = path.join( __dirname, '../assets/no-image.jpg' );
        res.sendFile( pathImg );


    } catch (msg) {
        console.log(msg.red);
        res.status(400).json({ msg });
    }
};

module.exports = {
    loadFile,
    updateImage,
    updateImageCloudinary,
    showImage,
};