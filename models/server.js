const express = require('express');
const cors = require('cors');
require('colors');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '../routes/user';

        // Middlewares
        this.middlewares();

        // Routes app
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Body parse request
        this.app.use( express.json() );

        // Public directory
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use('/api/users', require( this.usersPath ));
    }

    listen() {
        this.app.listen(this.port,
            () => console.log(`CORS-enabled server running at ${'http://localhost:'.yellow}${this.port.toString().yellow}`));
    }

}

module.exports = Server;