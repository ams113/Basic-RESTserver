require('colors');
const { Socket } = require('socket.io');
const { verifyJWT } = require('../helpers');
const { ChatMessage } = require('../models');

const chat = new ChatMessage();

const socketCtrl = async( socket = new Socket(), io ) => {
    

    const user = await verifyJWT(socket.handshake.headers.authorization);

    if ( !user ) {
        return socket.disconnect();
    }

    // Add user connect to chat
    chat.userConnect( user );
    io.emit('active-users', chat.usersArray );
    socket.emit('receive-messages', chat.lastTen);

    // private room connect
    socket.join( user.id ); // rooms: global, socket.id, user.id

    // Clean users disconnet to chat
    socket.on('disconnect', () => {
        chat.userDisconnect( user.id );
        io.emit('active-users', chat.usersArray );
    });

    // Propagate received message
    socket.on('send-message', ({ uid, message }) => {

        if ( uid ) {
            // Private message
            socket.to( uid ).emit('receive-private', { from: user.name, message} );
        } else {
            
            chat.sendMessage( user.id,  user.name, message );
            io.emit('receive-messages', chat.lastTen);
            
        }
    } );

}

module.exports = {
    socketCtrl,
};