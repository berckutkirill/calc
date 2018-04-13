const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DopSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Dop', DopSchema);