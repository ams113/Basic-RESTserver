const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const { dbConnection } = require('../db/config.db');
require('colors');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // Paths
        this.usersPath = '../routes/user.route';
        this.authPath = '../routes/auth.route';
        // Database connection
        this.MongoDBconnection();
        
        // Middlewares
        this.middlewares();

        // Routes app
        this.routes();
    }

    async MongoDBconnection() {

        // Enviorements connections
        await dbConnection();

    }

    middlewares() {
        // Helmet
        this.app.use(helmet());
        this.app.use(
            helmet({
                // X-Frame-Options: deny
                frameguard: {
                    action: "deny",
                },
                contentSecurityPolicy: {
                    directives: {
                      defaultSrc:["'self'"]
                    }
                }
            })
        );
        // CORS
        this.app.use( cors() );

        this.app.disable('x-powered-by');

        // Body parse request
        this.app.use( express.json() );

        // Public directory
        this.app.use( express.static('public') );

    }

    routes() {
        
        this.app.use('/api/auth', require( this.authPath ));
        this.app.use('/api/users', require( this.usersPath ));
    }

    listen() {
        this.app.listen(this.port,
            () => console.log(`CORS-enabled server running at ${'http://localhost:'.yellow}${this.port.toString().yellow}`));
    }

}

module.exports = Server;