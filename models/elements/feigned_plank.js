const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feignedPlankSchema = new Schema({
    width: Number,
    height: Number,
    deep: Number,
    params: {color: Schema.Types.ObjectId}
});

mongoose.model('FeignedPlank', feignedPlankSchema);