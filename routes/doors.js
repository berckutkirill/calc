const mongoose = require('mongoose');
const Helper = require('../models/Helper');
module.exports = function (router) {
    router.get('/updateDoor', function (req, res) {
        const needs = ['model', 'cloth', 'box', 'jamb', 'dock', 'threshold',
            'portal', 'cornice_board', 'feigned_plank', 'decorative_element'];
        const promises = [];
        const page = req.params.page ? req.params.page : 1;
        promises.push(Helper.getAll(needs));
        promises.push(new Promise(function (resolve, reject) {
            mongoose.model('baseDoor').paginate({}, {
                page: page, limit: 100,
                populate: [['model', 'title'],
                    {path: 'cloth', populate: [['model', 'title'], 'glass', ['color', 'title'], ['furnish', 'title']]},
                    'glass',
                    ['box', 'title'],
                    ['jamb', 'title'],
                    ['feigned_plank', 'title'],
                    ['dock', 'title'],
                    ['decorative_element', 'title'],
                    ['threshold', 'title'],
                    ['portal', 'title'],
                    ['cornice_board', 'title']
                ]
            }).then(function (cloth) {
                resolve(cloth);
            });
        }));
        Promise.all(promises).then(function (data) {
            res.render('updateDoor', {title: 'Express', 'data': {all: data[0], items: data[1]}});
        })
    });
    router.post('/updateDoor', function (req, res) {
        const oid = new mongoose.Types.ObjectId(req.body._id);
        delete req.body._id;
        for (const i in req.body) {
            if (req.body[i] === '') {
                req.body[i] = null;
            }
        }
        const updObj = req.body;
        mongoose.model('baseDoor').findByIdAndUpdate(oid, {$set: updObj}, {new: true}, function (err, door) {
            if (err) {
                return res.json({error: true, message: err});
            }
            return res.json({door: door});

        })
    });
    router.get('/addDoor', function (req, res) {
        const needs = ['color', 'lacobel','furnish', 'model', 'series', 'material', 'jamb', 'dock',
            'cloth', 'box', 'cloth_type', 'dop', 'decorative_element', 'material_series', 'series_model'];
        Helper.getAll(needs, {cloth: [['model', 'title'], 'glass', ['lacobel', 'title']]}).then(function (data) {
            data.portal = {code: 'portal', title: Helper.getTitle('portal')};
            data.cornice_board = {code: 'cornice_board', title: Helper.getTitle('cornice_board')};
            data.feigned_plank = {code: 'feigned_plank', title: Helper.getTitle('feigned_plank')};
            res.render('addDoor', {title: 'Express', 'data': data});
        });

    });
    router.post('/addDoor', function (req, res) {
        mongoose.model('baseDoor').create(req.body, function (err, result) {
            if(err) {
                return res.json(err)
            }
            return res.json(result)
        });
        // const keys = Object.keys(req.body);
        // const arr = Object.values(req.body).map(item => {
        //     if (!Array.isArray(item)) {
        //         return [item];
        //     }
        //     return item;
        // });
        // const data = Helper.allPossibleCases(arr);
        // for (const i in data) {
        //     const item = {};
        //     for (const j in keys) {
        //         item[keys[j]] = data[i][j];
        //     }
        //     mongoose.model('baseDoor').create(item);
        // }
    });
    router.post('/deleteDoor', function (req, res) {
        const oid = new mongoose.Types.ObjectId(req.body._id);
        mongoose.model('baseDoor').remove({_id: oid}, function (err) {
            if (err) {
                return res.json({error: true, message: err});
            }
            return res.json({deletedId: req.body._id});

        })
    });
    router.post('/deleteCloth', function (req, res) {
        const oid = new mongoose.Types.ObjectId(req.body._id);
        mongoose.model('Cloth').remove({_id: oid}, function (err) {
            if (err) {
                return res.json({error: true, message: err});
            }
            return res.json({deletedId: req.body._id});

        })
    });
};
