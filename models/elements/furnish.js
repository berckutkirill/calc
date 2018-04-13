const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const furnishSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Furnish', furnishSchema);