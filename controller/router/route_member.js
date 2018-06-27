const router = require('express').Router();
const Passport = require('../../model/service/passport');
const member_m = require('../../model/member/index');

router.route('/members').
    post(member_m.register).
    put(member_m.update).
    get(member_m.userData);

// normal user login
router.route('/login').
    post(member_m.login);

// google user login
router.route('/login_google').
    get(Passport.authenticate('google'));
 
router.route('/google/callback').
    get(Passport.authenticate_cb('google'),(req,res)=>{             
        res.redirect('/');
    });

// fb user login    
router.route('/login_fb').
    get(Passport.authenticate('facebook'));
      
router.route('/fb/callback').
    get(Passport.authenticate_cb('facebook'),(req,res)=>{                
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
    google 登入
    /login_google get 
    FB 登入
    /login_fb get 
*/