const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fourthSchema = new Schema({
    width: Number,
});

mongoose.model('Fourth', fourthSchema);