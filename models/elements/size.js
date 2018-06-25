const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    width: Number,
    height: Number,
    depth: Number,
};
const sizeSchema = new Schema(fields);
sizeSchema.set('toObject', { virtuals: true });
sizeSchema.set('toJSON', { virtuals: true });
sizeSchema.index({ width: 1, height: 1, depth: 1 }, { unique: true });
sizeSchema.virtual('title').get(function () {
    let titleStr = "";
    const titles = ['height', 'width', 'depth'];
    for(const key of titles) {
        if(this[key]) {
            if(titleStr.length) {
                titleStr += 'x';
            }
            titleStr += this[key];
        }
    }
    return titleStr.trim();
});
module.exports = mongoose.model('Size', sizeSchema);