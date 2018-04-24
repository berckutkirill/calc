const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fields = {
    title: {type:String, unique:true},
    width: {type:Number, title:'Ширина', possibleValues:[600, 900]},
    height: {type:Number, title:'Высота', possibleValues:[2000, 2200]},
    patina: {type:Boolean, title:'Патина'},
    reinforced: {type:Boolean, title:'Усиленный'}
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
