const mongoose = require('mongoose');
const Helper = require('../models/Helper');
module.exports = function (router) {

    router.post('/updateDecor', function (req, res) {
        const oid = new mongoose.Types.ObjectId(req.body._id);
        delete req.body._id;
        for(const i in req.body) {
            if(req.body[i] === '') {
                req.body[i] = null;
            }
        }
        const updObj = req.body;
        mongoose.model('DecorativeElement').findByIdAndUpdate(oid, {$set:updObj}, {new:true}, function (err, decor) {
            if(err) {
                return res.json({error: true, message:err});
            }
            return res.json({decor:decor});

        })
    });
    router.get('/updateDecor', function (req, res) {
        const needs = ['model', 'series', 'material','decorative_element'];
        const promises = [];
        promises.push(Helper.getAll(needs));
        promises.push(new Promise(function (resolve, reject) {
            mongoose.model('DecorativeElement').find({})
                .populate('model', 'title')
                .populate('series', 'title')
                .populate('material', 'title')
                .exec(function (err, cloth) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(cloth);
                    }
                });
        }));
        Promise.all(promises).then(function (data) {
            res.render('updateDecor', {title: 'Express', 'data': {all:data[0], items:data[1]}});
        })
    });
};
