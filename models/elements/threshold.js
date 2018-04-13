const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thresholdSchema = new Schema({
    width: Number,
});

mongoose.model('Threshold', thresholdSchema);