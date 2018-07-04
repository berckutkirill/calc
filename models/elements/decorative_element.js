const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decorativeElementSchema = new Schema({
    title:{type:String, unique:true},
    material: {type:Schema.Types.ObjectId, ref:'Material'},
    model: {type:Schema.Types.ObjectId, ref:'Model'},
    series: {type:Schema.Types.ObjectId, ref:'Series'},
    width: Number,
    color: Schema.Types.ObjectId,
    furnish: Schema.Types.ObjectId
});

mongoose.model('DecorativeElement', decorativeElementSchema);