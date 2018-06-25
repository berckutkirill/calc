const mongoose = require('mongoose');
const Helper = require('../models/Helper');
module.exports = function (router) {

    router.get('/addCloth', function (req, res) {
        mongoose.model('Cloth').getAllComponents().then(function (data) {
            res.render('addCloths', {title: 'Express', 'data': data});
        })
    });
    router.post('/addCloth', function (req, res) {

        const keys = Object.keys(req.body);
        const arr = Object.values(req.body).map(item => {
            if (!Array.isArray(item)) {
                return [item];
            }
            return item;
        });
        let data = Helper.allPossibleCases(arr);
        if(arr.length === 1) {
            for(const i in data) {
                data[i] = [data[i]];
            }
        }
        for (const i in data) {
            const item = {};
            for (const j in keys) {
                item[keys[j]] = data[i][j];
            }
            mongoose.model('Cloth').create(item, function (error) {
                if (error && error.code !== 11000) {
                    throw new Error(error.message)
                }
            });
        }
        res.json(req.body);
    });
    router.post('/updateCloth', function (req, res) {
        const oid = new mongoose.Types.ObjectId(req.body._id);
        delete req.body._id;
        for(const i in req.body) {
            if(req.body[i] === '') {
                req.body[i] = null;
            }
        }
        const updObj = req.body;
        mongoose.model('Cloth').findByIdAndUpdate(oid, {$set:updObj}, {new:true}, function (err, cloth) {
            if(err) {
                return res.json({error: true, message:err});
            }
            return res.json({cloth:cloth});

        })
    });
    router.get('/updateCloth', function (req, res) {
        const needs = ['model', 'color', 'furnish', 'glass'];
        const promises = [];
        promises.push(Helper.getAll(needs));
        promises.push(new Promise(function (resolve, reject) {
            mongoose.model('Cloth').find({})
                .populate('model', 'title')
                .populate('color', 'title')
                .populate('glass')
                .populate('furnish', 'title')
                .populate('lacobel', 'title')
                .populate('type', 'title')
                .populate('params', 'title')
                .populate('dop', 'title')
                .exec(function (err, cloth) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(cloth);
                    }
                });
        }));
        Promise.all(promises).then(function (data) {
            res.render('updateCloth', {title: 'Express', 'data': {all:data[0], items:data[1]}});
        })
    });
};
