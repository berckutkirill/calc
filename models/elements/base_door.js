const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const Helper = require("../Helper");
const Schema = mongoose.Schema;
const fields = {
    title: String,
    material: {type: Schema.Types.ObjectId, ref: 'Material', title: "Материал"},
    series: {type: Schema.Types.ObjectId, ref: 'Series', title: "Серия"},
    model: {type: Schema.Types.ObjectId, ref: 'Model', title: "Модель"},
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth', title: "Полотно"},
    cloth_type: {type: Schema.Types.ObjectId, ref: 'ClothType'},
    dop: {type: Schema.Types.ObjectId, ref: 'Dop'},
    color: [{type: Schema.Types.ObjectId, ref: 'Color', title: "Цвет"}],
    box: [{type: Schema.Types.ObjectId, ref: 'Box', title: "Коробка"}],
    furnish: [{type: Schema.Types.ObjectId, ref: 'Furnish', title: "Отделка"}],
    jamb: [{type: Schema.Types.ObjectId, ref: 'Jamb', title: "Наличник"}],
    dock: [{type: Schema.Types.ObjectId, ref: 'Dock', title: "Доборы"}],
    lacobel: [{type: Schema.Types.ObjectId, ref: 'Lacobel', title: "Лакобель"}],
    decorative_element: {type: Schema.Types.ObjectId, title: "Декоративные элементы"},
    portal: {type: Boolean, title: "Портал"},
    cornice_board: {type: Boolean, title: "Карнизная доска"},
    feigned_plank: {type: Boolean, title: "Притворная планка"}
};
const baseDoorSchema = new Schema(fields);
baseDoorSchema.plugin(mongoosePaginate);

baseDoorSchema.statics.getComponents = function () {
    return new Promise(function (resolve) {
        const deep = {'cloth': {'populate': function (model, cb) {
                    return model.find({})
                        .populate({ path: 'model', select: 'title' })
                        .populate({ path: 'color', select: 'title' })
                        .populate({ path: 'furnish', select: 'title' })
                        .populate({ path: 'lacobel', select: 'title' })
                        .populate('glass')
                        .populate({ path: 'dop', select: 'title' })
                        .exec(function (err, res) {
                        cb.call(this, err, res);
                    })
                }}};

        const promises = [];
        const data = {};
        const cb = function (err, res, i, item, resolve, reject) {
            if (err) {
                return reject(err);
            }
            data[i] = {title: item.title, code: i, values: res};
            resolve();
        };
        for(const i in fields) {
            const item = fields[i];
            if(typeof item === 'object') {
                if(!item['title']) { continue; }
                if(item['ref']) {
                    const Model = mongoose.model(item['ref']);
                    promises.push(new Promise(function (resolve, reject) {
                        if(deep[i] && deep[i]['populate']) {
                            deep[i]['populate'](Model, (function(i, item) {
                                return function(err, res) {
                                    cb.call(this, err, res, i, item, resolve, reject);
                                }
                            })(i, item));
                        } else {
                            Model.find({}).exec((function(i, item, resolve, reject) {
                                return function(err, res) {
                                    cb.call(this, err, res, i, item, resolve, reject);
                                }
                            })(i, item, resolve, reject));
                        }

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