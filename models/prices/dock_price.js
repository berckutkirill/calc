const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    material: {type: Schema.Types.ObjectId, ref: 'Material'},
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'},
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    quantity: Number,
    wall_min_width: Number,
    wall_max_width: Number,
    height: Number,
    price: Number,
    for_calc: Boolean
};
const dockPriceSchema = new Schema(fields);
dockPriceSchema.statics.getFromRequest = function (box, body, material) {
    return new Promise(function (resolve, reject) {

        const need = ['series', 'dock', 'furnish', 'color', 'height', 'dock[quantity]'];
        const q = {};
        for (const i in need) {
            if (body[need[i]]) {
                const new_code = need[i].replace(/.*\[(.*?)\]/, '$1');
                q[new_code] = body[need[i]];
            }
        }
        if (body['wall_width']) {
            q['wall_min_width'] = {$lte: body['wall_width']};
            q['wall_max_width'] = {$gt: body['wall_width']};
        }
        body.material = material.code;
        mongoose.model('DockPrice').find(q, function (err, DPrices) {
            if (err) {
                return reject(err);
            }
            const promises = [];

            if (DPrices && DPrices.length) {
                DPrices.forEach(function (DPrice) {
                    promises.push(DPrice.getPrice(body, DPrice));
                });
                Promise.all(promises).then(function (dprices) {
                    resolve(DPrices);
                })
            } else {
                resolve([]);
            }
        })
    });

};
const formules = [
    {
        material: ['emal', 'shpon_emal'],
        f: function (params) {
            return new Promise(function (resolve) {
                let tmp = (params['wall_width'] - 74) / 10 * params['quantity'] * 2;
                resolve(tmp * 1.4);
            });
        }
    }, {
        material: ['shpon_plastik', 'ecoshpon'],
        f: function (params) {
            return new Promise(function (resolve) {
                resolve((params['wall_width'] - 64) * this.price * params['quantity']);
            });
        }
    }, {
        material: ['shpon'],
        f: function (params) {
            const self = this;
            return new Promise(function (resolve, reject) {
                mongoose.model('BoxPrice').findOne({box: params.box}, function (err, box) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(self.price - box.getPrice());
                });
            })

        }
    },
];
dockPriceSchema.methods.getPrice = function (params, dockPrice) {
    const self = this;
    let price = this.price;
    const formula = formules.find(function (formula) {
        if (formula.material.indexOf(params.material) !== -1) {
            return true;
        }
    });
    return new Promise(function (resolve, reject) {
        if (formula) {
            formula.f.call(self, params).then(function (price) {
                dockPrice.price = price;
                resolve();
            }, function (err) {
                reject(err);
            })
        } else {
            dockPrice.price = price;
            resolve();
        }
    })

};
mongoose.model('DockPrice', dockPriceSchema);