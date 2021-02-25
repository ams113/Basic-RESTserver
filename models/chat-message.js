
class Message {
    constructor( uid, name, message ) {
        this.uid     = uid;
        this.name    = name;
        this.message = message;
    }
}

class ChatMessage {

    constructor() {
        this.messages = [];
        this.users = {};
    }

    get lastTen() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    get usersArray() {

        return Object.values( this.users );
    }

    sendMessage( uid, name, message ) {

        this.messages.unshift( new Message( uid, name, message) );
    }

    userConnect( user ) {
        this.users[ user.id ] = user;
    }
    
    userDisconnect( id ) {
        delete this.users[id];
    }

}

module.exports = ChatMessage;