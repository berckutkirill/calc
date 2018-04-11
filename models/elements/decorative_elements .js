const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decorativeElementsSchema = new Schema({
    title:{type:String, unique:true},
    price: Number,
    params: {width: Number, color: Schema.Types.ObjectId, furnish: Schema.Types.ObjectId, patina: Boolean}

});

mongoose.model('DecorativeElements', decorativeElementsSchema);