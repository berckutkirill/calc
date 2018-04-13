const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decorativeElementSchema = new Schema({
    title:{type:String, unique:true},
    params: {width: Number, color: Schema.Types.ObjectId, furnish: Schema.Types.ObjectId, patina: Boolean}

});

mongoose.model('DecorativeElement', decorativeElementSchema);