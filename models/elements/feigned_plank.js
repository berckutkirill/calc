const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feignedPlankSchema = new Schema({
    title: String,
    width: Number,
    height: Number,
    deep: Number,
    color: Schema.Types.ObjectId
});

mongoose.model('FeignedPlank', feignedPlankSchema);