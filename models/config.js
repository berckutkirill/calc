const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    maxStandardHeight: Number,
    maxStandardWidth: Number,
    standardWidths: Array,
    standardHeights: Array,
    cloth: {sizeTax: Number, bigSizeTax:Number}
};
const configSchema = new Schema(fields);
configSchema.statics.getConfig = function () {
    const self = this;
    return new Promise(function (resolve, reject) {
        self.findOne({}, function (err, config) {
            if(err) {
                return reject(err);
            }
            if(!config) {
                config = {};
            }
            return resolve(config);
        })
    })
};
module.exports = mongoose.model('Config', configSchema);