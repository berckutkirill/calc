const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thresholdSchema = new Schema({
    title: {type: String, unique: true}
});

mongoose.model('Threshold', thresholdSchema);