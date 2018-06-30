const service = require('../service/index');
const config = require('../../config/config');
const Member = require('./memberComponent');

class Model{
    
    static get Model() {
        return new Model();
    }    

    /**
     * 註冊新用戶的cb
     * @param   {req}  req
     * @param   {res}  res 
    */
    async register(req,res){
        
        const member = new Member();
         
        //確認信箱格式是否正確,不正卻回傳否,接著判斷密碼是否一致!!
        switch(parserRegisterData(req)){
            case 1 :
                res.render('register',{
                    msg : 'Email 格式錯誤!!'
                });
                return ;
            case 2 :
                res.render('register',{
                    msg : '密碼註冊不一致!!'
                });
                return ;
            case 3 :
                res.redirect('/user');
                return ;
            default : 
                break ;
        }
    
        //封裝資料
        const data = {
            oauth       : {
                oauth_id    : '',
                oauth_fn    : 'normal',
            },
            email : req.body.email ,
            name  : req.body.name  ,
            pwd   : service.encryption(req.body.pwd),
            create_date : service.timeFix.whatTime(),
            update_date : ''
        };
         
        //檢查是否有被註冊
        let chek_res = await service.emailCheck.multi(req).catch(err=>{        
            res.render('register',{
                msg : '註冊失敗'
            });
            return ;
        });
         
        //判斷是否重複,有--從新輸入 沒有--註冊資料
        if(chek_res){        
            res.render('register',{ msg : `信箱已被註冊` } );
        }else{
            await member.memberRegister(data).then(resolved=>{
                req.session.email = req.body.email ;
                res.redirect(301,'/');
            }).catch(err=>{
                res.render('register',{
                    msg : '註冊失敗'
                });
            });
        }    
    }

    /**
     * 登入用戶的cb
     * @param   {req}  req
     * @param   {res}  res 
    */
    async login(req,res){
     
        const member = new Member();
        // 防錯確認
        if(req.body.email =='' || req.body.pwd==""){
            res.render('index', {msg : '有欄位未填'});
            return ;
        }
        
        // 資料封裝
        const data = {
            email : req.body.email ,       
            pwd   : service.encryption(req.body.pwd)
        };
        
        // 登入ing...
        const resolved = await member.memberLogin(data).catch(err=>{            
            res.render('index', {msg : '登入失敗'});
            return ;
        });
        
        // 判斷登入成功?
        if( resolved.res ){
            req.session.email = req.body.email ;
            res.redirect('/');
        }else{
            res.render('index', { msg : resolved.msg});
        }     
    }

    /**
     * 用戶更新的cb
     * @param   {req}  req
     * @param   {res}  res 
    */
    update(req,res){
        const member = new Member();        
        // 基本判斷       
        switch(parserUpdateData(req)){
            case 1 :
                res.status(400).send('密碼 No match!');
                return ;
            case 2 :
                res.redirect('/');
                return ;
            default :
                break ;
        }          
       
        // 資料封裝
        const user = {       
            email : req.session.email ,
            name  : req.body.name  ,
            pwd   : service.encryption(req.body.pwd),
            update_date : service.timeFix.whatTime()
        };
        
        // 資料更新
        member.memberUpdate(user).then((resolved)=>{                    
            res.json(resolved);
        }).catch(err=>{      
            res.status(400).json(err);
        });
    }  

    /**
     * 查詢用戶的cb
     * @param   {req}  req
     * @param   {res}  res   
    */
    userData(req,res){    
        const member = new Member();

        // 基本判斷
        if(!req.session.email){           
            res.redirect('/');
            return ;
        }

        //搜尋資料
        member.memberData(req.session.email).then((resolved)=>{                  
            res.json(resolved);
        }).catch(err=>{       
            res.status(400).json(err);
        });        
    }
 
}

parserRegisterData = (req)=>{

    if(!service.emailCheck.format(req.body.email)){                 
        return 1;
    }else if(req.body.pwd !== req.body.rePwd){               
        return 2;
    }else if(req.session.email){                
        return 3;
    }
};

parserUpdateData = (req)=>{

    if(req.body.pwd !== req.body.rePwd ){               
        return 1 ;
    }else if(!req.session.email){                
        return 0 ;
    }
};   

module.exports = Model ;