const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fourthsSchema = new Schema({
    width: Number,
    price: Number,
});

mongoose.model('Fourths', fourthsSchema);