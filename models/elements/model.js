const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    title: {type: String, unique: true},
    series: {type: Schema.Types.ObjectId, ref: 'Series'}
});


mongoose.model('Model', modelSchema);