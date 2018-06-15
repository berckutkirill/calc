const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb'},
    basePrice: Number
};
const jambPriceSchema = new Schema(fields);
jambPriceSchema.methods.getPrice = function (diffSize) {
    if(diffSize) {
        return this.basePrice * 2;
    }
    return this.basePrice;
};
mongoose.model('JambPrice', jambPriceSchema);