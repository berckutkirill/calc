const mongoose = require('mongoose');
const Helper = require("../Helper");
const Schema = mongoose.Schema;

const fields = {
    model: {type: Schema.Types.ObjectId, ref: 'Model', title: "Модель", unique: true},
    glass: {type: Schema.Types.ObjectId, ref: 'Glass', title: "Стекло"},
    lacobel: {type: Schema.Types.ObjectId, ref: 'Lacobel', title: "Лакобель"}
};
const clothSchema = new Schema(fields);
clothSchema.set('toObject', { virtuals: true });
clothSchema.set('toJSON', { virtuals: true });
clothSchema
    .virtual('title')
    .get(function () {
        let titleStr = "";
        const titles = ['model', 'glass', 'lacobel'];
        for(const key of titles) {
            if(this[key]) {
                titleStr += ` ${this[key]['title']}`;

            }
        }
        return titleStr.trim();
    });
clothSchema.statics.getAllComponents = function () {
    return new Promise(function (resolve) {
        const promises = [];
        const data = {};
        for(const i in fields) {
            const item = fields[i];
            if(typeof item === 'object') {

                if(item['ref'] || Array.isArray(item)) {
                    let oneItem;
                    if(Array.isArray(item)) {
                        oneItem = item[0];
                    } else {
                        oneItem = item;
                    }
                    const Model = mongoose.model(oneItem['ref']);
                    promises.push(new Promise(function (resolve, reject) {
                        Model.find({}).exec(function (err, res) {
                            if (err) {
                                return reject(err);
                            }
                            data[i] = {title: oneItem.title, code: i, values: res};
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