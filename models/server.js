const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const permissionsPolicy = require('permissions-policy');
require('colors');
const { dbConnection } = require('../db/config.db');
const fileUpload = require('express-fileupload');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // Paths
        this.paths = {
            auth:       [ '/api/auth', '../routes/auth.route' ],
            categories: [ '/api/categories', '../routes/categories.route' ],
            products:   [ '/api/products', '../routes/products.route' ],
            search:     [ '/api/search', '../routes/search.route' ],
            uploads:    [ '/api/uploads', '../routes/uploads.route' ],
            users:      [ '/api/users', '../routes/users.route' ],
        };

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
        this.app.use(helmet.hidePoweredBy({ setTo: 'CULO 5.5'}));
        this.app.use(helmet.frameguard({ action: 'deny'}));

        /* this.app.use(
            helmet({
                // X-Frame-Options: deny
                frameguard: {
                    action: "deny",
                },
                contentSecurityPolicy: {
                    directives: {
                        
                      defaultSrc:["'none'"],
                      scriptSrc:["'none'",'https://apis.google.com/js/platform.js'],
                      objectSrc: ["'none'"],
                      upgradeInsecureRequests: [],
                    }
                }
            })
        ); */

        // PermissionsPolicy
        this.app.use(permissionsPolicy({
            features: {
              fullscreen:   ['self'],
              microphone:   ['none'],               
              camera:       ['none'],
              geolocation:  ['none']               
            }
          }));

        // CORS
        this.app.use( cors() );

        // this.app.disable('x-powered-by');

        // Body parse request
        this.app.use( express.json() );

        // Public directory
        this.app.use( express.static('public') );

        // FileUploads
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth[0],        require( this.paths.auth[1] ));
        this.app.use( this.paths.categories[0],  require( this.paths.categories[1] ));
        this.app.use( this.paths.products[0],    require( this.paths.products[1] ));
        this.app.use( this.paths.search[0],      require( this.paths.search[1] ));
        this.app.use( this.paths.uploads[0],     require( this.paths.uploads[1] ));
        this.app.use( this.paths.users[0],       require( this.paths.users[1] ));
    }

    listen() {
        this.app.listen(this.port,
            () => console.log(`CORS-enabled server running at ${'http://localhost:'.yellow}${this.port.toString().yellow}`));
    }

}

module.exports = Server;