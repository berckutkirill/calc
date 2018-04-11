const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docksSchema = new Schema({
    title:{type:String, unique:true},
    width: Number,
    height: Number,
    price: Number,
    params: {color: Schema.Types.ObjectId}

});

mongoose.model('Docks', docksSchema);