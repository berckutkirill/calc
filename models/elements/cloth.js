const mongoose = require('mongoose');
const Helper = require("../Helper");
const Schema = mongoose.Schema;

const fields = {
    model: {type: Schema.Types.ObjectId, ref: 'Model', title: "Модель"},
    color: {type: Schema.Types.ObjectId, ref: 'Color', title: "Цвет"},
    glass: {type: Schema.Types.ObjectId, ref: 'Glass', title: "Стекло"},
    lacobel: {type: Schema.Types.ObjectId, ref: 'Lacobel', title: "Лакобель"},
    type: {type: Schema.Types.ObjectId, ref: 'ClothType', title: "Тип"},
    furnish: {type: Schema.Types.ObjectId, ref: 'Furnish', title: "Отделка"},
    params: {type: Schema.Types.ObjectId, ref: 'ClothParams', title: "Параметры"},
    dop: {type: Schema.Types.ObjectId, ref: 'Dop', title: "Дополнительно"}
};
const notTitleChunks = ["_id", "title"];
const clothSchema = new Schema(fields);
clothSchema
    .virtual('title')
    .get(function () {
        return this;
    });

clothSchema.pre('validate', function (next) {
    const promises = [];
    for(const i in this._doc) {
        if(notTitleChunks.includes(i) || this._doc[i] == null) {
            continue;
        }
        if(this._doc[i].constructor.name === 'ObjectID') {
            promises.push(((self, i) => {
                const oid = self._doc[i];
                const model = fields[i]['ref'];
                return new Promise(function (resolve, reject) {
                    mongoose.model(model).
                    findById(oid, function (err, item) {
                        if(err) {
                            return reject(err);
                        }
                        const itm = {};
                        itm[i] = item.title;
                        resolve(itm);
                    })
                })
            })(this, i))
        } else {
            const self = this;
            promises.push(new Promise(function (resolve, reject) {
                const itm = {};
                itm[i] = self._doc[i];
                resolve(itm);
            }));
        }
    }
    const self = this;
    Promise.all(promises).then(values => {
        const title = {};
        values.map(function (item) {
            for(const i in item) {
                title[i] = item[i];
            }
        });
        self.title = title;
        next();
    });
});

clothSchema.statics.getAllComponents = function () {
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


mongoose.model('Cloth', clothSchema);