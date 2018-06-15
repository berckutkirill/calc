const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dockSchema = new Schema({
    title:{type:String, unique:true},
    width: Number,
    height: Number,
    color: {type: Schema.Types.ObjectId, ref: 'Color', title: "Цвет"},
    furnish: {type: Schema.Types.ObjectId, ref: 'Furnish', title: "Отделка"},
});

module.exports = mongoose.model('Dock', dockSchema);

mongoose.model('Dock').updateOne({"_id":mongoose.Types.ObjectId("5ae983c997e7293611fe356e")},
    {$set:{color: "5ae983c997e7293611fe3548", furnish: "5b0bbbae5f531f3d18d9ca0e"}}, function (err) {
    if(err) {
        console.log(err);
    }
});
