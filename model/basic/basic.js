exports.rootV = (req,res)=>{    
     
    if(req.user) {
        req.session.email = req.user.email;
        req.user = undefined;
    }
    
    if(req.session.email){
        res.render('user.jade' ); 
    }else{
        res.render('index.jade');
    }
    
};

exports.registerV = (req,res)=>{
    res.render('register.jade');
};

exports.logoutV = (req,res)=>{
    req.session.destroy();
    res.redirect(302,'/');
};