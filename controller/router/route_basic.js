let router = require('express').Router();
let basic_m = require('../../model/basic/basic');

router.route('/').
    get(basic_m.rootV);

router.route('/register').
    get(basic_m.registerV);

router.route('/logout').get(basic_m.logoutV);


module.exports = router ;