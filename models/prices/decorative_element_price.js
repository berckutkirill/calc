const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    decorative_element: {type: Schema.Types.ObjectId, ref: 'DecorativeElement'},
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    material: {type: Schema.Types.ObjectId, ref: 'Material'},
    patina: {type: Boolean, default: false},
    pora: Number,
    width: Number,
    price: Number
};
const decorativeElementPriceSchema = new Schema(fields);
decorativeElementPriceSchema.statics.getFromRequest = function (body) {
    const booleans = ['patina'];
    const price_fields = ['series', 'material', 'color', 'decorative_element','furnish', 'decorative_element[width]', 'decorative_element[pora]'];
    const q = {};
    return new Promise(function (resolve, reject) {
        price_fields.forEach(function (code) {
            if (typeof body[code] !== 'undefined' && body[code] !== '') {
                const new_code = code.replace(/.*\[(.*?)\]/, '$1');
                q[new_code] = body[code];
            }
        });
        booleans.forEach(function (code) {
            q[code] = body[code] === 'true';
        });
        mongoose.model('DecorativeElementPrice').find(q, function (err, items) {
            if (err) {
                return reject(err);
            }
            Config.getConfig().then(function (config) {
                items.forEach(function (item) {
                    item.price = item.getPrice(body, config);
                });
                return resolve(items);
            })

        })
    });
};
decorativeElementPriceSchema.methods.getPrice = function () {
    return this.price;
};
mongoose.model('DecorativeElementPrice', decorativeElementPriceSchema);