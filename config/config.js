const mongoose = require('mongoose');
const fs = require('fs');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/er');
const dirs = [__dirname + '/../models/elements/', __dirname + '/../models/', __dirname + '/../models/nodes/'];

for(const dir of dirs) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        if(fs.lstatSync(dir + files[i]).isFile()) {
            require(dir + files[i]);
        }
    }
}