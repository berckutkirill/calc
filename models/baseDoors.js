const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const baseDoorsSchema = new Schema({
    material: {type: Schema.Types.ObjectId, ref: 'Materials'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    model: {type: Schema.Types.ObjectId, ref: 'Models'},
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloths'},
    box: {type: Schema.Types.ObjectId, ref: 'Boxes'},
    jambs: {type: Schema.Types.ObjectId, ref: 'Jambs'},
    docks: {type: Schema.Types.ObjectId, ref: 'Docks'},
    threshold: {type: Schema.Types.ObjectId, ref: 'Thresholds'},
    portal: {type: Schema.Types.ObjectId, ref: 'Portals'},
    cornice_board: {type: Schema.Types.ObjectId, ref: 'CorniceBoards'},
    decorative_elements: {type: Schema.Types.ObjectId, ref: 'DecorativeElements'},
    feigned_plank: {type: Schema.Types.ObjectId, ref: 'FeignedPlanks'},
    fourth: {type: Schema.Types.ObjectId, ref: 'Fourths'},
});


const AllModels = [
    {"code":"models","title":"Модель", "schema":"Models"},
    {"code":"series","title":"Серия", "schema":"Series"},
    {"code":"materials","title":"Материал", "schema":"Materials"},
    {"code":"furnishes","title":"Фурнитура", "schema":"Furnishes"},
    {"code":"colors","title":"Цвет", "schema":"Colors"},
    {"code":"cloths","title":"Покрытие", "schema":"Cloths"},
    {"code":"cloth_types","title":"Покрытие", "schema":"ClothTypes"},
    {"code":"boxes","title":"Коробка", "schema":"Boxes"},
    {"code":"jambs","title":"Наличники", "schema":"Jambs"},
    {"code":"decorative_elements","title":"Декоративные элементы", "schema":"DecorativeElements"},
    {"code":"docks","title":"Доборы", "schema":"Docks"},
    {"code":"dops","title":"Дополнительно", "schema":"Dops"},
    {"code":"stains","title":"Витраж", "schema":"Stains"},
    {"code":"lacobels","title":"Лакобель", "schema":"Lacobels"},
    {"code":"glasses","title":"Стекло", "schema":"Glasses"}
];
function *generator() {
    for (const item in AllModels) {
        yield AllModels[item];
    }
}

baseDoorsSchema.statics.generator = generator;
baseDoorsSchema.statics.getAllComponents = function () {
    const promises = [];
    const data = [];
    return new Promise(function (resolve, reject) {
        for(const item of mongoose.model('baseDoors').generator()) {
            const Model = mongoose.model(item.schema);
            promises.push(new Promise(function (resolve, reject) {
                Model.find({}).exec(function (err, res) {
                    if(err) { return reject(err); }
                    data.push({title:item.title, code:item.code, values:res});
                    resolve();
                });
            }));
            Promise.all(promises).then(function () {resolve(data);})
        }
    })
};

mongoose.model('baseDoors', baseDoorsSchema);