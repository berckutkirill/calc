const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const furnishesSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Furnishes', furnishesSchema);