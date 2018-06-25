const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    width: {type:Number, title:'Ширина'},
    height: {type:Number, title:'Высота'},
    material: {type: Schema.Types.ObjectId, ref: 'Material'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    model: {type: Schema.Types.ObjectId, ref: 'Model'},
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth'},
    box: {type: Schema.Types.ObjectId, ref: 'Box'},
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'},
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb'},
    lacobel: {type: Schema.Types.ObjectId, ref: 'Lacobel'},
    glass: {type: Schema.Types.ObjectId, ref: 'Glass'},
    color: {type: Schema.Types.ObjectId, ref: 'Color'},
    furnish: {type: Schema.Types.ObjectId, ref: 'Furnish'}
};

const orderSchema = new Schema(fields);
module.exports = mongoose.model('Order', orderSchema);
