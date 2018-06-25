const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'}
};
const corniceBoardPriceSchema = new Schema(fields);
corniceBoardPriceSchema.methods.getPrice = function (params) {
    if(params['material'] === 'shponplastik') {
        return this.dock.getPrice() * params['quantity'] * 1.5;
    } else {
        params['width'] = params['width'] ? params['width'] : .1;
        return params['width'] * params['height'] * params['quantity'] * this.dock.getPrice() * 1.5;
    }
};
mongoose.model('CorniceBoardPrice', corniceBoardPriceSchema);