const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seriesSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Series', seriesSchema);