const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portalSchema = new Schema({
    width: Number,
});

mongoose.model('Portal', portalSchema);