let login = require('./component_login');
let register = require('./component_register');
let update  = require('./component_update');
let userData = require('./component_userData');

let service = require('../service/index');
let config = require('../../config/config');

// 註冊模組
exports.member_register = async (req,res)=>{
    /*
        確認信箱格式是否正確,
        不正卻回傳否,
        接著判斷密碼是否一致!!
    */
    if(!service.emailCheck.format(req.body.email)){
        res.render('register',{
            msg : 'Email 格式錯誤!!'
        });
        return ;
    }else if(req.body.pwd !== req.body.rePwd){
        res.render('register',{
            msg : '密碼註冊不一致!!'
        });
        return ;
    }else if(req.session.email){
        res.redirect('/user');
        return ;
    }

    //封裝資料
    const member_data = {
        email : req.body.email ,
        name  : req.body.name  ,
        pwd   : service.encryption(req.body.pwd),
        create_date : service.timeFix.whatTime(),
        update_date : ''
    };
     
    //檢查是否有被註冊
    let chek_res = await service.emailCheck.multi(req.body.email).catch(err=>{        
        res.render('register',{
            msg : '註冊失敗'
        });
        return ;
    });
     
    //判斷是否重複,有--從新輸入 沒有--註冊資料
    if(chek_res){        
        res.render('register',{ msg : `信箱已被註冊` } );
    }else{
        await register(member_data).then(resolved=>{
            req.session.email = req.body.email ;
            res.redirect(301,'/');
        }).catch(err=>{
            res.render('register',{
                msg : '註冊失敗'
            });
        });
    }    
}

// 登入模組
exports.member_login  = async (req,res)=>{
    // 防錯確認
    if(req.body.email =='' || req.body.pwd==""){
        res.render('index', {msg : '有欄位未填'});
        return ;
    }

    // 資料封裝
    const member_data = {
        email : req.body.email ,       
        pwd   : service.encryption(req.body.pwd)
    };

   
    // 登入ing...
    let resolved = await login(member_data).catch(err=>{
        res.render('index', {msg : '登入失敗'});
        return
    });
  
    // 判斷登入成功?
    if( resolved.res ){
        req.session.email = req.body.email ;
        res.redirect('/');
    }else{
        res.render('index', { msg : resolved.msg});
    }     
}

// 用戶資料修改模組
exports.member_update = (req,res)=>{

    if(req.body.pwd !== req.body.rePwd ){
        res.status(400).send('密碼 No match!');
        return ;
    }
    
    const member_data = {       
        email : req.session.email ,
        name  : req.body.name  ,
        pwd   : service.encryption(req.body.pwd),
        update_date : service.timeFix.whatTime()
    };
    
    update(member_data).then((resolved)=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}    

// 一般的取得資料
exports.member_userData = (req,res)=>{

    userData(req.session.email).then((resolved)=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}
