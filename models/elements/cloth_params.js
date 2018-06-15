const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fields = {
    title: {type:String, unique:true},
    height:Number,
    width:Number,
    patina: Boolean,
    reinforced: Boolean,
};
function getTitle() {
    const patina = this.patina ? `+${fields.patina.title}`: "";
    const reinforced = this.reinforced ? `${fields.reinforced.title}`: "";
    return `${fields.width.title}:${this.width}x${fields.height.title}:${this.height} ${reinforced} ${patina}`;
}
const clothParams = new Schema(fields);
clothParams.pre('validate', function (next) {
    const patina = this.patina ? `+${fields.patina.title}`: "";
    const reinforced = this.reinforced ? `${fields.reinforced.title}`: "";
    this.title = `${this.width}x${this.height} ${reinforced} ${patina}`;
    next();
});
mongoose.model('ClothParams', clothParams);
