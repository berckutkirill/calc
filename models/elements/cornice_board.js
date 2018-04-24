const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const corniceBoardSchema = new Schema({
    title: {type: String, unique:true}
});

mongoose.model('CorniceBoard', corniceBoardSchema);