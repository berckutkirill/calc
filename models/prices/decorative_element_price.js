const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    decorative_element: {type: Schema.Types.ObjectId, ref: 'DecorativeElement'},
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish'}],
    color: [{type: Schema.Types.ObjectId, ref: 'Color'}],
    material: {type: Schema.Types.ObjectId, ref: 'Material'},
    patina: Boolean,
    pora: Number,
    width: Number,
    price: Number
};
const decorativeElementPriceSchema = new Schema(fields);
decorativeElementPriceSchema.methods.getPrice = function (params) {
    return this.basePrice;
};
mongoose.model('DecorativeElementPrice', decorativeElementPriceSchema);