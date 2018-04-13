const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dockSchema = new Schema({
    title:{type:String, unique:true},
    width: Number,
    height: Number,
    params: {color: Schema.Types.ObjectId}

});

mongoose.model('Dock', dockSchema);