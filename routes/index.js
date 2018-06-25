const express = require('express');
const router = express.Router();

require('./init_db');

router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});
require('./order')(router);
require('./cloth')(router);
require('./doors')(router);
require('./nodes')(router);
require('./prices')(router);
module.exports = router;
