const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
    title: {type:String, unique:true}
});

mongoose.model('Material', materialSchema);