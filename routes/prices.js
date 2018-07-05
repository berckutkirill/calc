const mongoose = require('mongoose');
const Formules = require('../models/Formules');
const Helper = require('../models/Helper');
module.exports = function (router) {

    router.post('/getPrice', function (req, res) {
        mongoose.model('Material').findById(req.body.material, function (err, material) {
            if (err) {
                return res.json(err);
            }

            const promises = [];
            promises.push(new Promise(function (resolve, reject) {
                mongoose.model('BoxPrice').getFromRequest(req.body).then(function (boxes) {
                    let box;
                    if (boxes.length === 1) {
                        box = boxes[0];
                    }
                    mongoose.model('DockPrice').getFromRequest(box, req.body, material).then(function (docks) {
                        if (req.body['threshold']) {
                            if (box && docks && docks[0]) {
                                Formules.getThresholdPrice(box, docks[0], !!req.body['threshold_with_dock']).then(function (price) {
                                    console.log(price);
                                })
                            }

                        }
                        resolve([boxes, docks])
                    }, function (err) {
                        reject(err);
                    })
                }, function (err) {
                    reject(err);
                });

            }));
            promises.push(mongoose.model('DecorativeElementPrice').getFromRequest(req.body));
            promises.push(mongoose.model('JambPrice').getFromRequest(req.body));
            promises.push(mongoose.model('ClothPrice').getFromRequest(req.body));
            promises.push(Formules.getPortalPrice(req.body, material));
            Promise.all(promises).then(function (data) {
                return res.json(data);
            }, function (data) {
                return res.json(data);
            });
        });

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

    router.get('/setBoxPrice', function (req, res) {
        const needs = ['furnish', 'color', 'box', 'size', 'series'];

        Helper.getAll(needs).then(function (data) {
            res.render('setBoxPrice', {title: 'Express', 'data': data});
        });
    });
    router.post('/setBoxPrice', function (req, res) {
        mongoose.model('BoxPrice').create(req.body, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }

        });
        res.json(req.body);
    });


    router.get('/setJambPrice', function (req, res) {
        const needs = ['furnish', 'color', 'jamb', 'size', 'series'];

        Helper.getAll(needs).then(function (data) {
            res.render('setJambPrice', {title: 'Express', 'data': data});
        });
    });
    router.post('/setJambPrice', function (req, res) {
        mongoose.model('JambPrice').create(req.body, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }

        });
        res.json(req.body);
    });


    router.get('/setDockPrice', function (req, res) {
        const needs = ['furnish', 'color', 'dock', 'series'];

        Helper.getAll(needs).then(function (data) {
            res.render('setDockPrice', {title: 'Express', 'data': data});
        });
    });
    router.post('/setDockPrice', function (req, res) {
        mongoose.model('DockPrice').create(req.body, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }

        });
        res.json(req.body);
    });

    router.get('/setDecorPrice', function (req, res) {
        const needs = ['furnish', 'color', 'decorative_element', 'series', 'material'];

        Helper.getAll(needs).then(function (data) {
            res.render('setDecorPrice', {title: 'Express', 'data': data});
        });
    });
    router.post('/setDecorPrice', function (req, res) {
        mongoose.model('DecorativeElementPrice').create(req.body, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }
        });
        res.json(req.body);
    });
    router.get('/setFPPrice', function (req, res) {
        const needs = ['furnish', 'color', 'series', 'size'];
        Helper.getAll(needs).then(function (data) {
            res.render('setFPPrice', {title: 'Express', 'data': data});
        });
    });
    router.post('/setFPPrice', function (req, res) {
        mongoose.model('FeignedPlankPrice').create(req.body, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }
        });
        res.json(req.body);
    });


};
