const express = require('express');
const mongoose = require('mongoose');
const Helper = require('../models/Helper');
const router = express.Router();

require('./init_db');

router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});
router.post('/updateNode', function (req, res) {
    Helper.replaceNodes(req.body).then(function (data) {
        res.json(data);
    });
});
router.get('/updateNode', function (req, res) {
    const needs = ['model', 'series', 'material', 'material_series', 'series_model'];
    Helper.getAll(needs).then(function (data) {
        res.render('mainNodes', {title: 'Express', 'data': data});
    });
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

router.post('/deleteDoor', function (req, res) {
    const oid = new mongoose.Types.ObjectId(req.body._id);
    mongoose.model('baseDoor').remove({ _id:oid}, function (err) {
        if(err) {
            return res.json({error: true, message:err});
        }
        return res.json({deletedId: req.body._id});

    })
});
router.post('/deleteCloth', function (req, res) {
    const oid = new mongoose.Types.ObjectId(req.body._id);
    mongoose.model('Cloth').remove({ _id:oid}, function (err) {
        if(err) {
            return res.json({error: true, message:err});
        }
        return res.json({deletedId: req.body._id});

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


router.get('/setClothPrice', function (req, res) {
    const needs = ['furnish', 'color', 'cloth', 'cloth_type', 'dop'];

    Helper.getAll(needs, {'cloth': [['model', 'title'], ['glass', 'title'], ['lacobel', 'title']]}).then(function (data) {
        res.render('setClothPrice', {title: 'Express', 'data': data});
    });
});

router.post('/setClothPrice', function (req, res) {
    mongoose.model('ClothPrice').create(req.body, function (error) {
        if (error && error.code !== 11000) {
            throw new Error(error.message)
        }
    });
    res.json(req.body);
});

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
    let data;
    if(arr.length > 1) {
        data = Helper.allPossibleCases(arr);
    } else {
        data = arr;
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

router.get('/updateDoor', function (req, res) {
const needs = ['model', 'cloth', 'box', 'jamb', 'dock', 'threshold',
        'portal', 'cornice_board',  'feigned_plank',  'fourth', 'decorative_element'];
    const promises = [];
    const page = req.params.page ? req.params.page : 1;
    promises.push(Helper.getAll(needs));
    promises.push(new Promise(function (resolve, reject) {
        mongoose.model('baseDoor').paginate({}, {page: page, limit: 100,
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
                ['cornice_board', 'title'],
                ['fourth', 'title']
            ]
        }).then(function (cloth) {
            resolve(cloth);
        });
    }));
    Promise.all(promises).then(function (data) {
        res.render('updateDoor', {title: 'Express', 'data': {all:data[0], items:data[1]}});
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
    const needs = ['material_series', 'series_model'];
    const promises = [];
    promises.push(Helper.getAll(needs));
    promises.push(mongoose.model('baseDoor').getComponents());
    Promise.all(promises).then(function (data) {
        const obj = {fields: data[1], nodes: data[0]};
        res.render('addDoor', {title: 'Express', 'data': obj});
    });
});
router.post('/addDoor', function (req, res) {
    const keys = Object.keys(req.body);
    const arr = Object.values(req.body).map(item => {
        if (!Array.isArray(item)) {
            return [item];
        }
        return item;
    });
    const data = Helper.allPossibleCases(arr);
    for (const i in data) {
        const item = {};
        for (const j in keys) {
            item[keys[j]] = data[i][j];
        }
        mongoose.model('baseDoor').create(item);
    }
    res.json({})
});


module.exports = router;
