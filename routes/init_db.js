const fs = require('fs');
const mongoose = require('mongoose');
const Helper = require('../models/Helper');
const data = JSON.parse(fs.readFileSync('./routes/data.json', 'utf8'));

for(const item of Helper.AllModels) {
    const Model = mongoose.model(item.schema);
    if (!data[item.code]) {
        continue;
    }
    data[item.code].forEach(function (item) {
        Model.create(item, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }
        });

    });
}
