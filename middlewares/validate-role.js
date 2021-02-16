const { response } = require('express');
require('colors');


const isAdminRole = ( req, res = response, next ) => {

    if ( !req.user ) {
        console.log('[Error] validate-role: isAdminRole -> NO verify the token'.red );
        return res.status(500).json({
            msg: 'It is necessary to verify the token before the role'
        });
    }

    const { role, name } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {
        const msg = `${ name } is not authorized`;
        const log ='[Error] validate-role: ' + msg ;
        console.log(log.red);
        return res.status(401).json({
            msg
        });
    }

    next();
};

const verifyRoles = ( ...roles ) => {

    return ( req, res = response, next ) => {
    
        if ( !req.user ) {
            console.log('[Error] validate-role: verifyRoles -> NO verify the token'.red );
            return res.status(500).json({
                msg: 'It is necessary to verify the token before the role'
            });
        }

        if ( !roles.includes( req.user.role ) ) {
            console.log(`[Error] validate-role: verifyRoles -> User role required ${ roles }`.red );
            return res.status(401).json({
                msg: 'User role required'
            });
            
        }
        next();
    };

};

module.exports = {
    isAdminRole,
    verifyRoles
};