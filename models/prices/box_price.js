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
boxPriceSchema.statics.getFromRequest = function (body) {
    const booleans = [];
    const price_fields = ['series', 'box', 'color', 'furnish', 'size'];
    const q = {};
    booleans.forEach(function (code) {
        q[code] = body[code] === 'true';
    });

    return new Promise(function (resolve, reject) {
        price_fields.forEach(function (code) {
            if (typeof body[code] !== 'undefined') {

                q[code] = body[code];
            }
        });

        mongoose.model('BoxPrice').find(q, function (err, items) {
            if (err) {
                return reject(err);
            }
            items.forEach(function (item) {
                item.price = item.getPrice(body);
            });
            return resolve(items);
        });
    });
};
boxPriceSchema.methods.getPrice = function () {
    return this.price + 6;
};
mongoose.model('BoxPrice', boxPriceSchema);