const mongoose = require('mongoose');
module.exports = {
    getThresholdPrice: function (box, dock, by_box_with_dock) {
        return new Promise(function (resolve) {
            if(by_box_with_dock) {
                resolve(box.price / box.quantity / 2);
            } else {
                resolve((box.price / box.quantity) + (dock.price/ dock.quantity)) / 2;
            }
        })
    },
    getPortalPrice: function (body, material) {
        return new Promise(function (resolve, reject) {
            const ww = body['wall_width'];
            const h = body['height'];
            const q = body['portal[quantity]'];



            if(material.title === 'shpon' || material.title === 'ecoshpon' || material.title === 'shpon_plastik') {
                const q = {for_calc:true};

                const need = ['series', 'material', 'furnish', 'color'];
                need.forEach(function (item) {
                    if (body[item]) {
                        q[item] = body[item];
                    }
                });

                mongoose.model('DockPrice').findOne(q, function (err, price) {
                    if(err || !price) {
                        return reject(err)
                    }
                    resolve(ww/1000*h/1000*q*price.price);
                });
            } else if(material.title === 'shpon_emal' || material.title === 'emal') {
                let price = ww/1000*h/10*q*2;
                resolve(price * 1.4 );
            }

        })
    }
};