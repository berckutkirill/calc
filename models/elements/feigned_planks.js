const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feignedPlanksSchema = new Schema({
    width: Number,
    height: Number,
    deep: Number,
    price: Number,
    params: {color: Schema.Types.ObjectId}
});

mongoose.model('FeignedPlanks', feignedPlanksSchema);