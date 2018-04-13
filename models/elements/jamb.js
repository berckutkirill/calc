const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jambSchema = new Schema({
    title:{type:String, unique:true},
    patina: Boolean,
    width: Number,
    height: Number,
    deep: Number,
    params: {color: Schema.Types.ObjectId}

});

mongoose.model('Jamb', jambSchema);