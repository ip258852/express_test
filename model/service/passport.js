const passport = require('passport');
const passport_google = require('passport-google-oauth20');
const passport_fb = require('passport-facebook');
const key   = require('../../config/config');
const DB = require('./db_connect'); 
const time = require('./time_related');

class Passport{

    init(){
        // 寫入session
        passport.serializeUser((profile,cb)=>{        
            cb(null,profile.oauth.oauth_id);
        });

        //二次登入時看取得user資訊
        passport.deserializeUser(async (id,cb)=>{    
            
            const m_col = DB.getCol(key.mongo_config.db,key.mongo_config.collection_member);
            
            m_col.findOne({
                $or : [{
                    oauth : {
                        oauth_id : id ,
                        oauth_fn : 'facebook'
                    } 
                },{
                    oauth : {
                        oauth_id : id ,
                        oauth_fn : 'google'
                    } 
                }]
            }).then((data)=>{                    
                cb(null,data);    
            }).catch(err=>{
                throw {
                    status : 'XXX_db_research',
                    err_name : err.name,
                    err_msg : err.message
                } ;
            });   

        })
        //google策略
        passport.use(new passport_google({
            clientID : key.google_oath2.clientID,
            clientSecret : key.google_oath2.clientSecret,
            callbackURL : key.google_oath2.callbackURL
        },async (accessToken,refreshToken,profile,cb)=>{
            
            const m_col = DB.getCol(key.mongo_config.db,key.mongo_config.collection_member);
            const data = await m_col.findOne({
                email : profile.emails[0].value 
            }).catch(err=>{
                throw {
                    status : 'XXXx_db_research',
                    err_name : err.name,
                    err_msg : err.message
                } ;
            });                       

            if(data && data.oauth.oauth_fn==='google'){
                //第三方整合完畢,直接登入
                cb(null,data);
            }else if(data && data.oauth.oauth_fn=='normal'){
                //已存在用戶,整合第三方
                await m_col.findOneAndUpdate(data,{
                    $set : {
                        oauth       : {
                            oauth_id    : profile.id,
                            oauth_fn    : 'google',
                        },
                        update_date : time.whatTime()
                    }
                });
                const user = await m_col.findOne({
                    email : profile.emails[0].value 
                });
                cb(null,user);        
            }else if(data){
                //別的第三方使用者
                cb(false,'err')
            }else{
                //無用戶,新增帳號
                const user = await m_col.insertOne({
                    oauth       : {
                        oauth_id    : profile.id,
                        oauth_fn    : 'google',
                    },
                    email       : profile.emails[0].value,
                    pwd         : '',
                    name        : profile.displayName,
                    create_date :  time.whatTime(),
                    update_date :  ''
                });
                cb(null,user.ops[0]);
            }
       
        }));
        //FB策略
        passport.use(new passport_fb({
            clientID: key.fb_oath2.clientID,
            clientSecret: key.fb_oath2.clientSecret,
            callbackURL:  key.fb_oath2.callbackURL,
            profileFields: ['id', 'emails', 'name']
        },async function(accessToken, refreshToken, profile, cb) {
            
            const m_col = DB.getCol(key.mongo_config.db,key.mongo_config.collection_member);
            const data = await m_col.findOne({
                email : profile.emails[0].value
            }) 
            
            if(data && data.oauth.oauth_fn==='facebook'){
                //第三方整合完畢,直接登入
                cb(null,data);
            }else if(data && data.oauth.oauth_fn=='normal'){
                //已存在用戶,整合第三方
                await m_col.findOneAndUpdate(data,{
                    $set : {
                        oauth       : {
                            oauth_id    : profile.id,
                            oauth_fn    : 'facebook',
                        },
                        update_date : time.whatTime()
                    }
                });
                const user = await m_col.findOne({
                    email : profile.emails[0].value 
                });
                cb(null,user);        
            }else if(data){
                //別的第三方使用者
                cb(false,'err')
            }else{
                //無用戶,新增帳號
                const user = await m_col.insertOne({
                    oauth       : {
                        oauth_id    : profile.id,
                        oauth_fn    : 'facebook',
                    },
                    email       : profile.emails[0].value,
                    pwd         : '',
                    name        : `${profile.name.familyName}${profile.name.givenName}`,
                    create_date :  time.whatTime(),
                    update_date :  ''
                });
                cb(null,user.ops[0]);
            }                                
            
        }));

    }
    
    get passport() {
        return passport;
    }

    initialize(){
        return passport.initialize();
    }

    session(){
        return passport.session();
    }

    authenticate(target){
        switch(target){
            case 'google' :
                return passport.authenticate('google',{
                    scope : ['profile','email']
                });            
            case 'facebook' :
                return passport.authenticate('facebook',{
                    scope : ['email']
                });       
            default : throw new Error('Fuck');
        }
    }

    authenticate_cb(target){
        switch(target){
            case 'google' :
                return passport.authenticate('google');            
            case 'facebook' :
                return passport.authenticate('facebook');       
            default : throw new Error('Fuck');
        }
    }
}

module.exports = new Passport();
