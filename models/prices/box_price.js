const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    box: {type: Schema.Types.ObjectId, ref: 'Box'},
    color: [{type: Schema.Types.ObjectId, ref:'Color'}],
    furnish: [{type: Schema.Types.ObjectId, ref:'Furnish'}],
    size: [{type: Schema.Types.ObjectId, ref:'Size'}],
    quantity: Number,
    price: Number
};
const boxPriceSchema = new Schema(fields);
boxPriceSchema.methods.getPrice = function () {
    return this.price + 6;
};
mongoose.model('BoxPrice', boxPriceSchema);