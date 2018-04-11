const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StainsSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('Stains', StainsSchema);