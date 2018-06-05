let service = require('../service/index');
let config = require('../../config/config');
let component = require('./index_component');

const redis = require('redis');
const client = redis.createClient();

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
        await component.register(member_data).then(resolved=>{
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
    let resolved = await component.login(member_data).catch(err=>{
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
    // 基本判斷
    if(req.body.pwd !== req.body.rePwd ){
        res.status(400).send('密碼 No match!');
        return ;
    }else if(!req.session.email){
        res.redirect('/');
        return ;
    }
    
    // 資料封裝
    const member_data = {       
        email : req.session.email ,
        name  : req.body.name  ,
        pwd   : service.encryption(req.body.pwd),
        update_date : service.timeFix.whatTime()
    };
    
    // 資料更新
    component.update(member_data).then((resolved)=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}    

// 一般的取得資料
exports.member_userData = (req,res)=>{
    // 基本判斷
    if(!req.session.email){
       res.redirect('/');
       return ;
    }

    client.get(req.session.email,(err,reply)=>{
        if(err) console.log(err);
        if(reply){                    
            res.json(JSON.parse(reply));
        }else{            
            getUserDate(req.session.email,res);
        }
    })

/*
    // 取得資料
    component.userData(req.session.email).then((resolved)=>{
        res.json(resolved);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    });
*/    
}

const getUserDate = (q,res)=>{
    component.userData(q).then((resolved)=>{
        client.setex(q,555555555555555,JSON.stringify(resolved));
        res.json(resolved);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    });
    
     
}
