const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'},
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    quantity:Number,
    wall_min_width:Number,
    wall_max_width:Number,
    height:Number,
    price: Number,
    for_calc: Boolean
};
const dockPriceSchema = new Schema(fields);
dockPriceSchema.methods.getPrice = function (params) {
    if(params['material'] === 'emal' || params['material'] === 'shponemal') {
        const piece = ((((params['wall_width'] - 74) / 10) * params['quantity']) * 2);
        return piece + piece * 0.4

    } else if(params['material'] === 'eshpon' || params['material'] === 'shponplastik') {
        return (params['wall_width'] - 64) * this.price * params['quantity'];
    } else {
        return this.price - params.box.getPrice();

    }


};
mongoose.model('DockPrice', dockPriceSchema);