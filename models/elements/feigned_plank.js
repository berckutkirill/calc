const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feignedPlankSchema = new Schema({
    title: {type: String, unique:true},
    width: Number,
    height: Number,
    deep: Number,
    color: Schema.Types.ObjectId
});

mongoose.model('FeignedPlank', feignedPlankSchema);