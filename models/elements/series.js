const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seriesSchema = new Schema({
    title:{type:String, unique:true},
    material: {type: Schema.Types.ObjectId, ref: 'Material'}
});

mongoose.model('Series', seriesSchema);