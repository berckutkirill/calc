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
                    const inpromises = [];
                    let box;
                    if (boxes.length && req.body['cornice_board']) {
                        box = boxes[0];
                        inpromises.push(Formules.getCornicePrice(req.body, box, material));
                    } else {
                        inpromises.push(Promise.resolve(0));
                    }
                    inpromises.push(new Promise(function (resolve, reject) {
                        mongoose.model('DockPrice').getFromRequest(box, req.body, material).then(function (docks) {
                            if (req.body['threshold'] && box && docks && docks[0]) {
                                Formules.getThresholdPrice(box, docks[0], !!req.body['threshold_with_dock']).then(function (price) {
                                    resolve({boxes:boxes, docks:docks, threshold:price});
                                })
                            } else {
                                resolve({boxes:boxes, docks:docks, threshold:0})
                            }
                        }, function (err) {
                            reject(err);
                        })
                    }));
                    Promise.all(inpromises).then(function (data) {
                        resolve({cornice:data[0], boxes:data[1]['boxes'], docks:data[1]['docks'], threshold:data[1]['threshold']});
                    },function (err) {
                        reject(err);
                    })
                }, function (err) {
                    reject(err);
                });

            }));
            promises.push(mongoose.model('FeignedPlankPrice').getFromRequest(req.body));
            promises.push(mongoose.model('DecorativeElementPrice').getFromRequest(req.body));
            promises.push(mongoose.model('JambPrice').getFromRequest(req.body));
            promises.push(mongoose.model('ClothPrice').getFromRequest(req.body));
            promises.push(Formules.getPortalPrice(req.body, material));
            Promise.all(promises).then(function (data) {
                const response = {
                    cornice: data[0]['cornice'],
                    boxes: data[0]['boxes'],
                    docks: data[0]['docks'],
                    threshold: data[0]['threshold'],
                    feigned_plank: data[1],
                    decorative_element: data[2],
                    jamb: data[3],
                    cloth: data[4]
                };
                return res.json(response);
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
