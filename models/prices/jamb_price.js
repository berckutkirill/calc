const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb'},
    color: [{type: Schema.Types.ObjectId, ref:'Color'}],
    furnish: [{type: Schema.Types.ObjectId, ref:'Furnish'}],
    size: [{type: Schema.Types.ObjectId, ref:'Size'}],
    quantity: Number,
    patina: {type: Boolean, default: false},
    price: Number
};
const jambPriceSchema = new Schema(fields);
jambPriceSchema.statics.getFromRequest = function (body) {
    const booleans = ['patina'];
    const price_fields = ['series', 'jamb', 'color', 'furnish', 'size'];
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
        mongoose.model('JambPrice').find(q).populate('size').exec(function (err, items) {
            if (err) {
                return reject(err);
            }
            items.forEach(function (item) {
                item.price = item.getPrice(body['jambSize']);
            });
            return resolve(items);
        })
    });
};
jambPriceSchema.methods.getPrice = function (size) {
    if(size && size.width !== this.size.width) {
        return this.price * 2;
    }
    return this.price;
};
mongoose.model('JambPrice', jambPriceSchema);