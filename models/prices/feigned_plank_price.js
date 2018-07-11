const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    material: [{type: Schema.Types.ObjectId, ref: 'Material'}],
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    sizes: [{type: Schema.Types.ObjectId, ref: 'Sizes'}],
    price: Number
};
const feignedPlankPriceSchema = new Schema(fields);
feignedPlankPriceSchema.statics.getFromRequest= function (body) {
    return new Promise(function (resolve, reject) {
        const need = ['material', 'furnish', 'color', 'feigned_plank[sizes]'];
        const q = {};
        for (const i in need) {
            if (body[need[i]]) {
                const new_code = need[i].replace(/.*\[(.*?)\]/, '$1');
                q[new_code] = body[need[i]];
            }
        }
        mongoose.model('FeignedPlankPrice').find(q, function (err, items) {
            if (err) {
                return reject(err);
            }
            resolve(items);
        });
    })

};

mongoose.model('FeignedPlankPrice', feignedPlankPriceSchema);