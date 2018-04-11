const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DopsSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Dops', DopsSchema);