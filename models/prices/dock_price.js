const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
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
dockPriceSchema.statics.getFromRequest = function (box, body) {
    mongoose.model('Material').findById(new mongoose.Types.ObjectId(body.material), function (err, material) {
        if (err || !material) {
            return reject(err);
        }
// here (find what i need for find right DockPrice)
    });
};
const formules = [
    {
        material: ['emal', 'shpon_emal'],
        f: function (params) {
            let tmp = (params['wall_width'] - 74) / 10 * params['quantity'] * 2;
            return tmp * 1.4;
        }
    }, {
        material: ['shpon_plastik', 'ecoshpon'],
        f: function (params) {
            return (params['wall_width'] - 64) * this.price * params['quantity'];
        }
    }, {
        material: ['shpon'],
        f: function (params, box) {
            return this.price - box.getPrice();
        }
    },
];
dockPriceSchema.methods.getPrice = function (box, params) {
    let price;
    const formula = formules.find(function (formula) {
        if (formula.material.indexOf(params.material) !== -1) {
            return true;
        }
    });
    if (formula) {
        price = formula.f.call(this, params, box);
    }
    return price;
};
mongoose.model('DockPrice', dockPriceSchema);