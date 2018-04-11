const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thresholdsSchema = new Schema({
    price: Number,
});

mongoose.model('Thresholds', thresholdsSchema);