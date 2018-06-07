const mongoose = require("mongoose");
const fs = require("fs");
module.exports = {
    AllModels: JSON.parse(fs.readFileSync(__dirname + '/../public/data/allModels.json', 'utf8')),
    capitalize: function (str) {
        if (!str) {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    toArray: function (item) {
        if (!item) {
            return [];
        }
        if (Array.isArray(item)) {
            return item;
        }
        return [item];
    },
    getNodeModel: function (requestData) {
        const Model = this.capitalize(requestData.k_item_one) + this.capitalize(requestData.k_item_two);
        return mongoose.model(Model);
    },
    generatePossibleValues: function* (requestData) {
        requestData.item_one = this.toArray(requestData[requestData['k_item_one']]);
        requestData.item_two = this.toArray(requestData[requestData['k_item_two']]);
        const possibleValues = this.allPossibleCases([requestData.item_one, requestData.item_two]);
        for (const i in possibleValues) {
            const item = possibleValues[i];
            const obj = {};
            obj[requestData.k_item_one] = item[0];
            obj[requestData.k_item_two] = item[1];
            yield obj;
        }
    },
    findNodes: function (model, data) {
        const obj = {};
        if (data[data.k_item_one]) {
            obj[data.k_item_one] = data[data.k_item_one];
        }
        if (data[data.k_item_two]) {
            obj[data.k_item_two] = data[data.k_item_two];
        }
        return new Promise(function (resolve, reject) {
            model.find(obj, function (error, items) {
                if (error) {
                    return reject(error);
                }
                return resolve(items);
            });
        });
    },
    deleteNodes: function (model, data) {
        return new Promise(function (resolve, reject) {
            model.remove(data, function (error, res) {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                resolve(res);
            })
        });
    },
    addNodes: function (model, data) {
        const self = this;
        return new Promise(function (resolve, reject) {
            for (const item of self.generatePossibleValues(data)) {
                model.create(item, function (error) {
                    if (error && error.code !== 11000) {
                        reject(error.message)
                    }
                });
            }

            resolve();
        })
    },
    updateNodes: function (model, conditions, data) {
        return new Promise(function (resolve, reject) {
            model.update(conditions, data, {multiple: true}, function (error, result) {
                if (error && error.code !== 11000) {
                    reject(error.message)
                }
                resolve(result);
            });
        })
    },
    replaceNodes: function (data) {
        const self = this;
        return new Promise(function (resolve, reject) {
            if (!data['k_item_one'] || !data['k_item_two']) {
                reject('Wrong data');
            }
            const k_item_one = data['k_item_one'];
            const k_item_two = data['k_item_two'];
            const item_one = self.toArray(data[k_item_one]);
            let item_two = self.toArray(data[k_item_two]);

            const model = self.getNodeModel(data);
            const filterForGetAll = {k_item_one: k_item_one, k_item_two: k_item_two};
            filterForGetAll[k_item_one] = item_one;

            self.findNodes(model, filterForGetAll).then(function (result) {
                const deleteIds = [];
                result.forEach(function (item) {
                    const itemTwoIndex = item_two.indexOf(item[k_item_two].toString());
                    if (itemTwoIndex !== -1) {
                        delete item_two[itemTwoIndex];
                    } else {
                        deleteIds.push(item._id);
                    }
                });
                item_two = item_two.filter(function (item) {
                    return item;
                });
                self.deleteNodes(model, {_id: {$in: deleteIds}});
                data[k_item_two] = item_two;
                self.addNodes(model, data);
                resolve();
            });
        })
    },
    getDiff: function (first, second) {

    },
    getAll: function (codes) {
        const promises = [];
        const data = {};
        let needs;
        if (!codes) {
            needs = this.AllModels;
        } else {
            needs = this.AllModels.filter(function (item) {
                return codes.indexOf(item.code) !== -1;
            });
        }
        const self = this;
        return new Promise(function (resolve) {
            needs.map(function (item) {
                const Model = mongoose.model(item.schema);
                promises.push(new Promise(function (resolve, reject) {
                    Model.find({}).exec(function (err, res) {
                        if (err) {
                            return reject(err);
                        }
                        data[item.code] = {title: item.title, code: item.code, values: res};
                        resolve();
                    });
                }));
                Promise.all(promises).then(function () {
                    self.alphabetSort(data);
                    resolve(data);
                })
            })

        })
    },
    alphabetSort: function (data) {
        for (const i in data) {
            if (data[i] && data[i].values) {
                data[i].values.sort(function (a, b) {
                    if (a.title < b.title) return -1;
                    if (a.title > b.title) return 1;
                    return 0;
                })
            }
        }
    },
    allUniquePossibleCases: function (arr) {
        const cases = this.allPossibleCases(arr);
        const unique = [...new Set(cases.map(item => item))];
        return unique;
    },
    allPossibleCases: function (arr) {
        if (!arr || arr.length === 0) {
            return []
        }
        if (arr.length === 1) {
            if (Array.isArray(arr[0])) {
                return arr[0];
            } else {
                return [arr[0]];
            }
        } else {
            let result = [];
            const allCasesOfRest = this.allPossibleCases(arr.slice(1));  // recur with the rest of array
            for (let i = 0; i < allCasesOfRest.length; i++) {
                for (let j = 0; j < arr[0].length; j++) {
                    if (Array.isArray(allCasesOfRest[i])) {
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
