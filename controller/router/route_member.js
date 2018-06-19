let router = require('express').Router();
let passport = require('../../model/service/passport');
let member_m = require('../../model/member/index');

router.route('/members').
    post(member_m.register).
    put(member_m.update).
    get(member_m.userData);

router.route('/login').
    post(member_m.login);

router.route('/login_google').
    get(passport.passport.authenticate('google',{
        scope : ['profile','email']
    }));

router.route('/google/callback').
    get(passport.passport.authenticate('google'),(req,res)=>{             
        res.redirect('/');
    });
 

module.exports = router ;


/*

    新增會員
    /  members post
    取得會員
    /  members get
    更改會員
    /  members put
    
    登入
    /login post
    google登入
    /login_google get 
 
*/