const express = require('express');
const mongoose = require('mongoose');
const Helper = require('../models/Helper');
const router = express.Router();
require('./init_db');

router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});
router.post('/addNode', function (req, res) {
    Helper.addNode(req.body);


});
router.get('/addNode', function (req, res) {
    const needs = ['model', 'series', 'material'];

    Helper.getAll(needs).then(function (data) {
        res.render('mainNodes', {title: 'Express', 'data': data});
    });
});




router.get('/addCloth', function (req, res) {
    mongoose.model('Cloth').getAllComponents().then(function (data) {
        res.render('addCloths', {title: 'Express', 'data': data});
    })
});
router.post('/addCloth', function (req, res) {
    const keys = Object.keys(req.body);
    const arr = Object.values(req.body).map(item => {
        if(!Array.isArray(item)) {
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
        mongoose.model('Cloth').create(item);
    }

    res.json({})
});

// router.get('/addDoor', function (req, res) {
//     mongoose.model('baseDoors').getComponents().then(function (data) {
//         res.render('addDoor', {title: 'Express', 'data': data});
//     })
// });
router.post('/addDoor', function (req, res) {

    const keys = Object.keys(req.body);
    const arr = Object.values(req.body).map(item => {
        if(!Array.isArray(item)) {
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
        mongoose.model('baseDoors').create(item);
    }

    res.json({})
});



module.exports = router;
