const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    box: {type: Schema.Types.ObjectId, ref: 'Box'},
    color: [{type: Schema.Types.ObjectId, ref:'Color'}],
    furnish: [{type: Schema.Types.ObjectId, ref:'Furnish'}],
    basePrice: Number
};
const boxPriceSchema = new Schema(fields);
boxPriceSchema.methods.getPrice = function () {
    const self = this;
    return new Promise(function (resolve) {
        mongoose.model('StandardPrices').findOne({code: "box_price"}, function (err, price) {
            if(err || !price) {
               return resolve(self.basePrice);
            }
            return resolve(self.basePrice + price);
        })
    });
};
mongoose.model('BoxPrice', boxPriceSchema);