const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    code: {type:String, unique: true},
    price: Number
};
const standardPricesSchema = new Schema(fields);
module.exports = mongoose.model('StandardPrices', standardPricesSchema);