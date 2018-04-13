const mongoose = require("mongoose");

module.exports = {
    AllModels : [
        {"code":"box","title":"Коробка", "schema":"Box"},
        {"code":"cloth","title":"Покрытие", "schema":"Cloth"},
        {"code":"cloth_type","title":"Покрытие", "schema":"ClothType"},
        {"code":"color","title":"Цвет", "schema":"Color"},
        {"code":"cornice_board","title":"Карнизная доска", "schema":"CorniceBoard"},
        {"code":"decorative_element","title":"Декоративные элементы", "schema":"DecorativeElement"},
        {"code":"dock","title":"Доборы", "schema":"Dock"},
        {"code":"dop","title":"Дополнительно", "schema":"Dop"},
        {"code":"feigned_plank", "title":"Притворная планка", "schema":"FeignedPlank"},
        {"code":"fourth","title":"Четверть", "schema":"Fourth"},
        {"code":"furnish","title":"Фурнитура", "schema":"Furnish"},
        {"code":"glass","title":"Стекло", "schema":"Glass"},
        {"code":"jamb","title":"Наличники", "schema":"Jamb"},
        {"code":"lacobel","title":"Лакобель", "schema":"Lacobel"},
        {"code":"material","title":"Материал", "schema":"Material"},
        {"code":"model","title":"Модель", "schema":"Model"},
        {"code":"portal","title":"Портал", "schema":"Portal"},
        {"code":"series","title":"Серия", "schema":"Series"},
        {"code":"stain","title":"Витраж", "schema":"Stain"},
        {"code":"threshold","title":"Порог","schema":"Threshold"},
        {"code":"cloth_params","title":"Параметры основы","schema":"ClothParams"}
    ],
    addNode:function (data) {
        console.log(this.AllModels);
        const oModel = this.AllModels.find(function (item) {
            return item.code === data.item;
        });
        if(oModel) {
            const upd = {};
            upd[data['owner']] = new mongoose.Types.ObjectId(data[data['owner']]);
            const Model = mongoose.model(oModel.schema);
            Model.update({_id: {$in:data[data.item]}}, upd, {multi:true}, function (err, res) {
                console.log(err, res);
            })
        }
        console.log(data[data.item]);
        console.log(data[data.owner]);
    },
    getAll : function (codes) {
        const promises = [];
        const data = {};
        let needs;
        if(!codes) {
            needs = this.AllModels;
        } else {
            needs = this.AllModels.filter(function (item) {
                return codes.indexOf(item.code) !== -1;
            });
        }
        return new Promise(function (resolve) {
            needs.map(function (item) {
                const Model = mongoose.model(item.schema);
                promises.push(new Promise(function (resolve, reject) {
                    Model.find({}).exec(function (err, res) {
                        if(err) { return reject(err); }
                        data[item.code] = {title: item.title, code: item.code, values: res};
                        resolve();
                    });
                }));
                Promise.all(promises).then(function () {resolve(data);})
            })

        })
    },
    allPossibleCases: function(arr) {
        if (arr.length === 1) {
            if(Array.isArray(arr[0])) {
                return arr[0];
            } else {
                return [arr[0]];
            }
        } else {
            let result = [];
            const allCasesOfRest = this.allPossibleCases(arr.slice(1));  // recur with the rest of array
            for (let i = 0; i < allCasesOfRest.length; i++) {
                for (let j = 0; j < arr[0].length; j++) {
                    if(Array.isArray(allCasesOfRest[i])) {
                        result.push([arr[0][j], ...allCasesOfRest[i]]);
                    } else {
                        result.push([arr[0][j], allCasesOfRest[i]]);
                    }
                }
            }
            return result;
        }
    }
};
