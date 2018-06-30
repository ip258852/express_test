const router = require('express').Router();
const Passport = require('../../model/service/passport');
const m = require('../../model/member/memberModel').Model;



router.route('/members').
    post(m.register).
    put(m.update).
    get(m.userData);

// normal user login
router.route('/login').
    post(m.login);

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