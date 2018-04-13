const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StainSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Stain', StainSchema);