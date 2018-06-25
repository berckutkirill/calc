const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;
const prices = {
    reinforced:50
};
const fields = {
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth'},
    color: [{type: Schema.Types.ObjectId, ref:'Color'}],
    furnish: [{type: Schema.Types.ObjectId, ref:'Furnish'}],
    type: [{type: Schema.Types.ObjectId, ref: 'ClothType', title: "Тип"}],
    dop: [{type: Schema.Types.ObjectId, ref: 'Dop', title: "Дополнительно"}],
    patina: Boolean,
    reinforced: Boolean,
    price: Number
};
const clothPriceSchema = new Schema(fields);
clothPriceSchema.statics.getFromRequest = function (body) {
    const cloth_price_fields = ['cloth', 'color', 'furnish', 'type', 'dop'];
    const q = {};
    return new Promise(function (resolve, reject) {
        cloth_price_fields.forEach(function (code) {
            if(typeof body[code] !== 'undefined') {
                q[code] = body[code];
            }
        });
        mongoose.model('ClothPrice').find(q, function (err, items) {
           if(err) {
               return reject(err);
           }
            return resolve(items);
        })
    })

}
clothPriceSchema.methods.calculatePrice = function (params, config) {
    const self = this;
    let price = self.price;
    let h = params['width'];
    let w = params['height'];
    const reinforced = params['reinforced'];
    w = w ? w : config.standardWidths[0];
    h = h ? h : config.standardHeights[0];
    if (config.standardWidths.indexOf(w) === -1 || config.standardHeights.indexOf(h) === -1) {
        let tax;
        if (h > config.maxStandardHeight || w > config.maxStandardWidth) {
            tax = config.cloth.sizeTax;
        } else {
            tax = config.cloth.bigSizeTax;
        }
        price *= tax;
    }
    if (reinforced && !self.reinforced) {
        price += prices.reinforced;
    }
    const pw = w*0.1;
    const ph = h*0.1;
    return price*ph*pw;
};
clothPriceSchema.methods.getPrice = function (params) {
    const self = this;
    return new Promise(function (resolve) {
        Config.getConfig().then(function (config) {
            return resolve(self.calculatePrice(params, config));
        });
    });
};
module.exports = mongoose.model('ClothPrice', clothPriceSchema);