const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decorativeElementSchema = new Schema({
    title:{type:String, unique:true},
    width: Number,
    color: Schema.Types.ObjectId,
    furnish: Schema.Types.ObjectId
});

mongoose.model('DecorativeElement', decorativeElementSchema);