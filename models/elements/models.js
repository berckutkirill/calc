const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelsSchema = new Schema({
    title: {type: String, unique: true}
});


mongoose.model('Models', modelsSchema);