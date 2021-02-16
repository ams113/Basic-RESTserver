const { response } = require('express');
const bcrypt = require('bcryptjs');
require('colors');
const User = require('../models/user.schema');
const { generateJWT } = require('../helpers/jwt');

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if email exists
        const user = await User.findOne({ email });
        console.log('[Info] findOne: email -> ' + user);
       
        if ( !user ) {
            const msg ='Invalid Email / Password - email';
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
            const msg ='Invalid Email / Password - password';
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

module.exports = {
    login
};