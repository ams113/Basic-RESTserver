const  { Schema, model } = require('mongoose');
require('colors');

const UserSchema = Schema({
    name: {
        type: String,
        required: [ true, 'The name is required'.red],
    },
    email: {
        type: String,
        required: [ true, 'The email is required'.red],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'The password is required'.red],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: [ true, 'The role is required'.red],
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date, 
        default: Date.now 
    },
    updateAt: {
        type: Date, 
        default: Date.now 
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
};

module.exports = model('User', UserSchema ); 