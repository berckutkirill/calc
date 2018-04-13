const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const corniceBoardSchema = new Schema({
    width: Number,
    params: {
        color: Schema.Types.ObjectId,
        patina: Boolean,
        furnish: Schema.Types.ObjectId
    }

});

mongoose.model('CorniceBoard', corniceBoardSchema);