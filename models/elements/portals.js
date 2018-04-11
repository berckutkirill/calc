const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portalsSchema = new Schema({
    width: Number,
    price: Number,
});

mongoose.model('Portals', portalsSchema);