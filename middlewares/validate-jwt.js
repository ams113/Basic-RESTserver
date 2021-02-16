const { response, request } = require("express");
const jwt = require("jsonwebtoken");
require('colors');

const User = require('../models/user.schema');

const validateJWT = async( req = request, res = response, next ) => {
    

    try {
        let [bearer, token] = req.header('Authorization').split(' ');
        
        token = !token ? token = bearer : token;


        if (!token ) {
            return res.status(401).json({
                msg: 'Token required'
            });
        } 

        try {

            const { uid } = jwt.verify( token, process.env.SECRET );
            const user = await User.findById( uid );
            console.log('[Info] validate-jwt: Find uid -> ' + user);
            // Check if status user is true

            if ( !user ) {
                console.log('[Error] validate-jwt: user -> null'.red );
                return res.status(401).json({
                    
                    msg: 'Invalid Token'
                });
            }

            if ( !user.state ) {
                console.log('[Error] validate-jwt: user.state -> False'.red );
                return res.status(401).json({
                    msg: 'Invalid Token'
                });
            }

            

            req.user = user;
            next();
            
        } catch (error) {
            console.log('[Error] validate-jwt: Invalid Token'.red );
            console.log(error);
            return res.status(401).json({
                msg: 'Invalid Token'
            });
        }
        
    } catch (error) {
        console.log('[Error] validate-jwt: Header Authorization -> null'.red );
        return res.status(401).json({
            msg: 'Token required'
        });
    }

};


module.exports = {
    validateJWT
};