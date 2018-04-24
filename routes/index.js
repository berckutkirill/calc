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
        mongoose.model('Cloth').create(item,function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }
        });
    }

    res.json(req.body);
});

router.get('/addDoor', function (req, res) {
    const needs = ['material_series', 'series_model'];
    const promises = [];
    promises.push(Helper.getAll(needs));
    promises.push(mongoose.model('baseDoor').getComponents());
    Promise.all(promises).then(function (data) {
        const obj = {fields: data[1], nodes: data[0]};
        res.render('addDoor', {title: 'Express', 'data':obj});
    });
});
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
        mongoose.model('baseDoor').create(item);
    }
    res.json({})
});



module.exports = router;
