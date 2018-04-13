const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boxSchema = new Schema({
    title: {type:String, unique:true},
    width: Number,
    height: Number,
    deep: Number,
    params: {
        color: Schema.Types.ObjectId,
        patina: Boolean,
        furnish: Schema.Types.ObjectId
    }

});
mongoose.model('Box', boxSchema);