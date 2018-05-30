exports.rootV = (req,res)=>{    
    if(req.session.email){
        res.render('user.jade',{username:req.session.email}); 
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