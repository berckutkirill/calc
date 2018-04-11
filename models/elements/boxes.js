const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boxesSchema = new Schema({
    title: {type:String, unique:true},
    width: Number,
    height: Number,
    deep: Number,
    price: Number,
    params: {
        color: Schema.Types.ObjectId,
        patina: Boolean,
        furnish: Schema.Types.ObjectId
    }

});
mongoose.model('Boxes', boxesSchema);