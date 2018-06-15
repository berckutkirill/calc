const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'},
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    basePrice: Number
};
const dockPriceSchema = new Schema(fields);
dockPriceSchema.methods.getPrice = function (box) {

    return this.basePrice - box.getPrice();
};
mongoose.model('DockPrice', dockPriceSchema);