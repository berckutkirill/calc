const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const lacobelSchema = new Schema({
    title:{type:String, unique:true},
    color:{type:String, unique:true}
});

mongoose.model('Lacobel', lacobelSchema);