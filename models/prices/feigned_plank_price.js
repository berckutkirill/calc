const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    sizes: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    price: Number
};
const feignedPlankPriceSchema = new Schema(fields);
feignedPlankPriceSchema.methods.getPrice = function () {
    return this.price;
};
mongoose.model('FeignedPlankPrice', feignedPlankPriceSchema);