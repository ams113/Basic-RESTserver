const mongoose = require('mongoose');
require('colors');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('>> MongoDB online'.green);

    } catch (error) {
        console.log('[Error] MongoDB connection error'.red);

        console.log(error);
        throw new Error('Error!!! no init DB :(');
    }
};

module.exports = {
    dbConnection,
}