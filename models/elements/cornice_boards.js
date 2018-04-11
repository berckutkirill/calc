const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const corniceBoardsSchema = new Schema({
    width: Number,
    price: Number,
    params: {
        color: Schema.Types.ObjectId,
        patina: Boolean,
        furnish: Schema.Types.ObjectId
    }

});

mongoose.model('CorniceBoards', corniceBoardsSchema);