const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'}
};
const portalPriceSchema = new Schema(fields);
portalPriceSchema.methods.getPrice = function (params) {
    if(params['material'] === 'shpon') {
        return params['wall_width'] / 1000 * params['height'] * params['quantity'] * this.dock.getPrice();
    } else {
        const piece = params['wall_width'] / 10 * params['quantity'] * 2;
        return piece + piece * .4;
    }
};
mongoose.model('PortalPrice', portalPriceSchema);