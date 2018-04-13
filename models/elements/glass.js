const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const glassSchema = new Schema({
    color:String,
    satin:Boolean,
    stained:Boolean,
    width: Number,
    facet: Number,
    roasted: Boolean
});
glassSchema.index({ color: 1, satin: 1, stained: 1, width: 1, facet: 1 , roasted: 1 }, { unique: true });
glassSchema
    .virtual('title')
    .get(function () {
        return (this.color ? this.color : "") + (this.stained ? " витраж":"") +
            (this.facet ? " фацет": "") + (this.roasted ? " закалённое" : "") +
            (this.width ? " "+ this.width + "мм" : "");
    });
mongoose.model('Glass', glassSchema);