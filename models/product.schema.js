const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
    name: {
        type: String,
        required: [ true, 'The name is required'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: [ true, 'The state is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'The User is required']
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [ true, 'The Category is required']
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true,
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

ProductSchema.methods.toJSON = function() {
    const { __v, state, ...product } = this.toObject();
    
    return product;
};


module.exports = model( 'Product', ProductSchema);