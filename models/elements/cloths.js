const mongoose = require('mongoose');
const Schema = mongoose.Schema;
function getTitle(ob_title) {
    return `${ob_title.width}x${ob_title.height}`;
}
const fields = {
    title:{type:Object, unique:true, required:true, get:getTitle},
    width: Number,
    height: Number,
    price: Number,
    patina: Boolean,
    reinforced: Boolean,
    material: {type: Schema.Types.ObjectId, ref: 'Materials'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    model: {type: Schema.Types.ObjectId, ref: 'Models'},
    color: {type: Schema.Types.ObjectId, ref: 'Colors'},
    glass: {type: Schema.Types.ObjectId, ref: 'Glasses'},
    lacobel: {type: Schema.Types.ObjectId, ref: 'Lacobels'},
    type: {type: Schema.Types.ObjectId, ref: 'ClothTypes'},
    furnish: {type: Schema.Types.ObjectId, ref: 'Furnishes'}
};
const notTitleChunks = ["_id", "title"];
const clothsSchema = new Schema(fields);

clothsSchema.pre('validate', function (next) {
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

const AllModels = [
    {"code":"width","title":"Ширина", "values":[{title:600, _id:600}, {title:900, _id:900}]},
    {"code":"height","title":"Высота", "values":[{title:2000, _id:2000},{title:2200, _id:2200}]},
    {"code":"patina","title":"Патина", "values":[{title:"да", _id:true}, {title:"нет",_id:false}]},
    {"code":"reinforced","title":"Усиленный", "values":[{title:"да", _id:true}, {title:"нет",_id:false}]},
    {"code":"material","title":"Материал", "schema":"Materials"},
    {"code":"series","title":"Серия", "schema":"Series"},
    {"code":"model","title":"Модель", "schema":"Models"},
    {"code":"glass","title":"Стекло", "schema":"Glasses"},
    {"code":"lacobel","title":"Лакобель", "schema":"Lacobels"},
    {"code":"color","title":"Цвет", "schema":"Colors"},
    {"code":"type","title":"Тип", "schema":"ClothTypes"},
    {"code":"furnish","title":"Отделка", "schema":"Furnishes"}
];

clothsSchema.statics.getAllComponents = function () {
    return new Promise(function (resolve, reject) {
        const promises = [];
        const data = [];
        for (const i in AllModels) {
            const item = AllModels[i];
            if(AllModels[i]['schema']) {
                const Model = mongoose.model(AllModels[i]['schema']);
                promises.push(new Promise(function (resolve, reject) {
                    Model.find({}).exec(function (err, res) {
                        if (err) {
                            return reject(err);
                        }
                        data.push({title: item.title, code: item.code, values: res});
                        resolve();
                    });
                }));
            } else {
                data.push(item);
            }
        }

        Promise.all(promises).then(function () {
            resolve(data);
        })
    })
};


mongoose.model('Cloths', clothsSchema);