const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boxSchema = new Schema({
    title: {type:String, unique:true},
    width: Number,
    height: Number,
    deep: Number
});
mongoose.model('Box', boxSchema);