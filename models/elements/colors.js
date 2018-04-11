const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colorsSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Colors', colorsSchema);