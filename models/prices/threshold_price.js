const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    width_with_dock: Boolean,
    price: Number

};
const thresholdPriceSchema = new Schema(fields);
thresholdPriceSchema.methods.getPrice = function (box, dock) {
    if(this.width_with_dock) {
        return box.getPrice()  / box.quantity / 2
    } else {
        return (box.getPrice() / box.quantity + dock.getPrice()) / 2;
    }
};
mongoose.model('ThresholdPrice', thresholdPriceSchema);