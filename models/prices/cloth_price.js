const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth'},
    color: [{type: Schema.Types.ObjectId, ref:'Color'}],
    furnish: [{type: Schema.Types.ObjectId, ref:'Furnish'}],
    type: [{type: Schema.Types.ObjectId, ref: 'ClothType', title: "Тип"}],
    dop: [{type: Schema.Types.ObjectId, ref: 'Dop', title: "Дополнительно"}],
    height:Number,
    width:Number,
    patina: Boolean,
    reinforced: Boolean,
    price: Number
};
const clothPriceSchema = new Schema(fields);
clothPriceSchema.methods.getPrice = function () {
    const self = this;
    return new Promise(function (resolve) {
        Config.getConfig().then(function (config) {
            const h = self['cloth']['params']['height'];
            const w = self['cloth']['params']['width'];
            if (config.standardWidths.indexOf(w) === -1 || config.standardHeights.indexOf(h) === -1) {
                let tax;
                if (h > config.maxStandardHeight || w > config.maxStandardWidth) {
                    tax = config.cloth.sizeTax;
                } else {
                    tax = config.cloth.bigSizeTax;
                }
                const price = self.price * tax;
                resolve(price);
            } else {
                resolve(self.basePrice);
            }
        });
    });
};
module.exports = mongoose.model('ClothPrice', clothPriceSchema);