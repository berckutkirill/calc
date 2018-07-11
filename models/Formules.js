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
    getCornicePrice: function (body, box, material) {
        const q = 1;
        let bw = body['board_width'] ? body['board_width'] : .1;
        return new Promise(function (resolve) {
            if(material.code === 'shpon' || material.code === 'ecoshpon') {
                resolve(bw * (body['height'] / 1000) * q * box.price * 1.5);
            } else if(material.code === 'emal' || material.code === 'shpon_emal') {
                const price =  bw * (body['height']/1000) * q * box.price * 1.5;
                resolve(price * 1.5);
            } else if(material.code === 'shpon_plastik') {
                resolve( box.price * q * 1.5);
            } else {
                resolve(0);
            }
        });
    },

    getPortalPrice: function (body, material) {
        return new Promise(function (resolve, reject) {
            const ww = body['wall_width'];
            const h = body['height'];
            const quantity = body['portal[quantity]'];
            if(material.code === 'shpon' || material.code === 'ecoshpon' || material.code === 'shpon_plastik') {
                const q = {for_calc:true};

                const need = ['series', 'material', 'furnish', 'color'];
                need.forEach(function (item) {
                    if (body[item]) {
                        q[item] = body[item];
                    }
                });

                mongoose.model('DockPrice').findOne(q, function (err, price) {
                    if(err ) {
                        return reject(err)
                    }
                    if(!price) {
                        return resolve(0);
                    }
                    resolve(ww/1000*h/1000*quantity*price.price);
                });
            } else if(material.code === 'shpon_emal' || material.code === 'emal') {
                let price = ww/1000*h/10*quantity*2;
                resolve(price * 1.4 );
            }

        })
    }
};