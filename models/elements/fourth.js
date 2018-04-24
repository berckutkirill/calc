const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fourthSchema = new Schema({
    title: {type: String, unique:true},
    height: Number,
});

mongoose.model('Fourth', fourthSchema);