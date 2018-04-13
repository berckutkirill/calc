const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Color', colorSchema);