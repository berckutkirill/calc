const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    series: [{type: Schema.Types.ObjectId, ref: 'Series'}],
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb'},
    color: [{type: Schema.Types.ObjectId, ref:'Color'}],
    furnish: [{type: Schema.Types.ObjectId, ref:'Furnish'}],
    size: [{type: Schema.Types.ObjectId, ref:'Size'}],
    quantity: Number,
    patina: Boolean,
    price: Number
};
const jambPriceSchema = new Schema(fields);
jambPriceSchema.methods.getPrice = function (size) {
    if(size.width !== this.size.width) {
        return this.price * 2;
    }
    return this.price;
};
mongoose.model('JambPrice', jambPriceSchema);