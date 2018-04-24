const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portalSchema = new Schema({
    title: {type:String, unique: true}
});

mongoose.model('Portal', portalSchema);