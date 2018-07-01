const Passport = require('../../model/service/passport');
const router = require('express').Router();
const routerb = require('express').Router();
const o = require('../../model/order/orderModel').Model;
const p = require('../../model/product/productModel').Model;
const m = require('../../model/member/memberModel').Model;
const b = require('../../model/basic/basic');

routerAttachM = ()=>{
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
}

routerAttachP = ()=>{
    router.route('/products').
        get(p.listAll);
}

routerAttachO = ()=>{
    router.route('/orders').
        post(o.create).
        get(o.listAll).
        put(o.update).
        delete(o.delete);

    router.route('/payments').
        get(o.payAll);
}

class Routers{
    get init(){        
        routerAttachM();
        routerAttachP();
        routerAttachO();
        return router;        
    }       

    get initB(){
        routerb.route('/').
            get(b.rootV);

        routerb.route('/register').
            get(b.registerV);

        routerb.route('/logout').
            get(b.logoutV);
        
        return routerb;
    }
}

module.exports = new Routers();