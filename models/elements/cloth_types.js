const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clothTypesSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('ClothTypes', clothTypesSchema);