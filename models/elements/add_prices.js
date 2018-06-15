const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    title: String,
    elementId: Schema.Types.ObjectId,
    elementWith: Schema.Types.ObjectId,
    addPrice: Number,
    addPercent: Number
};
const addPricesSchema = new Schema(fields);