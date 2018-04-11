const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialsSchema = new Schema({
    title: {type:String, unique:true}
});

mongoose.model('Materials', materialsSchema);