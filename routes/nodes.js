const Helper = require('../models/Helper');
module.exports = function (router) {
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
};
