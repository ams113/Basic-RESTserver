const { Schema, model } = require("mongoose");


const CategorySchema = Schema({
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
    createAt: {
        type: Date, 
        default: Date.now 
    },
    updateAt: {
        type: Date, 
        default: Date.now 
    }

});

CategorySchema.methods.toJSON = function() {
    const { __v, state, ...category } = this.toObject();
    
    return category;
};


module.exports = model( 'Category', CategorySchema);