const mongoose = require('mongoose');
const Helper = require("./Helper");
const Schema = mongoose.Schema;
const fields = {
    material: {type: Schema.Types.ObjectId, ref: 'Material', title: "Материал"},
    series: {type: Schema.Types.ObjectId, ref: 'Series', title: "Серия"},
    model: {type: Schema.Types.ObjectId, ref: 'Model', title: "Модель"},
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth', title: "Полотно"},
    box: {type: Schema.Types.ObjectId, ref: 'Box', title: "Коробка"},
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb', title: "Наличник"},
    dock: {type: Schema.Types.ObjectId, ref: 'Dock', title: "Доборы"},
    threshold: {type: Boolean,  title: "Порог"},
    portal: {type: Boolean, title: "Портал"},
    cornice_board: {type: Boolean, title: "Карнизная доска"},
    decorative_element: {type: Schema.Types.ObjectId, ref: 'DecorativeElement', title: "Декоративные элементы"},
    feigned_plank: {type: Boolean, title: "Притворная планка"},
    fourth: {type: Boolean, title: "Четверть"},
};
const baseDoorSchema = new Schema(fields);
baseDoorSchema.statics.getComponents = function () {
    return new Promise(function (resolve, reject) {
        const promises = [];
        const data = {};
        for(const i in fields) {
            const item = fields[i];
            if(typeof item === 'object') {
                if(!item['title']) { continue; }
                if(item['ref']) {
                    const Model = mongoose.model(item['ref']);
                    promises.push(new Promise(function (resolve, reject) {
                        Model.find({}).exec(function (err, res) {
                            if (err) {
                                return reject(err);
                            }
                            data[i] = {title: item.title, code: i, values: res};
                            resolve();
                        });
                    }));
                } else if(item['type'] === Boolean) {
                    item['values'] = [{title:"да", _id:true}, {title:"нет",_id:false}];
                    item['code'] = i;
                    data[i] = item;
                } else {
                    item['code'] = i;
                    data[i] = item;
                }

            } else {
                console.error(item);
            }
        }

        Promise.all(promises).then(function () {
            Helper.alphabetSort(data);
            resolve(data);
        })
    })
};

mongoose.model('baseDoor', baseDoorSchema);