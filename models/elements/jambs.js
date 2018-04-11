const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jambsSchema = new Schema({
    title:{type:String, unique:true},
    patina: Boolean,
    width: Number,
    height: Number,
    deep: Number,
    price: Number,
    params: {color: Schema.Types.ObjectId}

});

mongoose.model('Jambs', jambsSchema);