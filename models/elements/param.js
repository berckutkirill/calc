const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    title: {type:String, unique:true},
};
const paramSchema = new Schema(fields);
module.exports = mongoose.model('Param', paramSchema);