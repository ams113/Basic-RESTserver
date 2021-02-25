const { response } = require('express');
const bcrypt = require('bcryptjs');
require('colors');

const User = require('../models/user.schema');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if email exists
        const user = await User.findOne({ email });
        console.log('[Info] findOne: email -> ' + user);
       
        if ( !user ) {
            const msg ='Invalid Email / Password';
            const log ='[error]  Login: Email -> False';
            console.log( log.red );
    
            return res.status(400).json({
                msg
            });
        }
        // Check if user state true
        if ( !user.state ) {
            const msg ='Invalid Email / Password - user deleted';
            const log ='[error]  Login: state -> False';
            console.log( log.red );

            return res.status(400).json({
                msg
            });
        }

        // Check password
        const checkPass = bcrypt.compareSync( password, user.password );

        if ( !checkPass ) {
            const msg ='Invalid Email / Password';
            const log ='[error]  Login: checkPass -> False';
            console.log( log.red );

            return res.status(400).json({
                msg
            });
        }
        // Generate JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log('[Error] authController: Login: -> '.red + error);

        return res.status(500).json({
            msg: 'Boom!!!'
        });
    }  
};

const googleSignin = async( req, res = response) => {


    const { id_token } = req.body;

    
    try {
        const { name, img, email } = await googleVerify( id_token );

        console.log('[Info] googleSignin: googleUser -> ', { name, img, email } );

        let user = await User.findOne( { email } );

        if ( !user ) {
            // Create new user
            const googleUser = {
                name,
                email,
                password: '******',
                img,
                google: true
            };

            user = new User( googleUser );

            await user.save(); 

            console.log('[Info] save: USER -> ' + user);
        }

        // User deleted
        if ( !user.state ) {
            console.log('[Error] authController: googleSignin: -> User deleted'.red);
            return res.status(401).json({
                msg: 'User deleted'
            });

        }

        // Generate JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });


    } catch (error) {
        console.log('[Error] authController: googleSignin: -> Invalid Token'.red);
        return res.status(400).json({
            msg: 'Invalid Token'
        });
    }
};

const renewToken = async( req, res = response) => {

    const { user } = req;

    const token = await generateJWT( user.id );

    res.json({
        user,
        token
    });

};

module.exports = {
    login,
    googleSignin,
    renewToken,
};