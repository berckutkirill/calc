const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clothTypeSchema = new Schema({
    title:{type:String, unique:true}
});

mongoose.model('ClothType', clothTypeSchema);