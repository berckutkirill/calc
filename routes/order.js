const mongoose = require('mongoose');
const Helper = require('../models/Helper');
module.exports = function (router) {
    router.get('/addNewOrder', function (req, res) {
        const needs = ['material', 'cloth', 'box', 'dock', 'jamb', 'cloth_type', 'dop', 'lacobel','glass',
            'color', 'furnish', 'model', 'decorative_element',
            'series', 'material', 'material_series', 'series_model'];
        Helper.getAll(needs, {'cloth': [['model', 'title'], ['glass', 'title'], ['lacobel', 'title']]})
            .then(function (data) {
                data.portal = {code: 'portal', title: Helper.getTitle('portal')};
                data.cornice_board = {code: 'cornice_board', title: Helper.getTitle('cornice_board')};
                data.feigned_plank = {code: 'feigned_plank', title: Helper.getTitle('feigned_plank')};
                data.threshold = {code: 'threshold', title: Helper.getTitle('threshold')};
                data.reinforced = {code: 'reinforced', title: Helper.getTitle('reinforced')};
                data.patina = {code: 'patina', title: Helper.getTitle('patina')};
            res.render('newOrder', {title: 'Express', 'data': data});
        });
    });
    router.post('/getBaseDoors', function (req, res) {
        const Model = mongoose.model('baseDoor');
        if(req.body.cloth) {
            const Cloth = mongoose.model('Cloth');
            const q = {};
            if(req.body.model) {
                q['model'] = req.body.model;
            }
            Object.assign(q, req.body.cloth);
            Cloth.find(q, function (err, cloth) {
                if(err) {
                    return res.json(err);
                }
                if(!cloth) {
                    return res.json([]);
                }
                req.body.cloth = cloth;
                Model.find(req.body).populate('cloth').exec(function (err, doors) {
                    if(err) {return res.json(err);}
                    return res.json(doors);
                })
            })
        } else {
            Model.find(req.body).populate('cloth').exec(function (err, doors) {
                if(err) {return res.json(err);}
                return res.json(doors);
            })
        }

    });
    router.post('/addNewOrder', function (req, res) {
        mongoose.model('Order').create(req.body, function (error) {
            if (error && error.code !== 11000) {
                throw new Error(error.message)
            }
        });
        res.json(req.body);
    });

};
