const passport = require('passport');
const passport_google = require('passport-google-oauth20');
const key   = require('../../config/config');
const db = require('./db_connect'); 
const time = require('./time_related');
// init db
(async()=>{
    await db.dbConnect('mongodb://localhost:27017');    
    console.log('passport db open');
})();
// 寫入session
passport.serializeUser((profile,cb)=>{        
    cb(null,profile.oauth.oauth_id);
});

//二次登入時看取得user資訊
passport.deserializeUser(async (id,cb)=>{    
    
    const m_col = db.getCol(key.mongo_config.db,key.mongo_config.collection_member);
     
    m_col.findOne({
        oauth : {
            oauth_id : id ,
            oauth_fn : 'google'
        } 
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

passport.use(new passport_google({
    clientID : key.google_oath2.clientID,
    clientSecret : key.google_oath2.clientSecret,
    callbackURL : key.google_oath2.callbackURL
},async (accessToken,refreshToken,profile,cb)=>{
    
    const m_col = db.getCol(key.mongo_config.db,key.mongo_config.collection_member);
    m_col.findOne({
        oauth : {
            oauth_id : profile.id ,
            oauth_fn : 'google'
        } 
    }).then((data)=>{
       
        if(data){            
            cb(null,data);
        }else{
            
            m_col.insertOne({
                oauth       : {
                    oauth_id    : profile.id,
                    oauth_fn    : 'google',
                },
                email       : profile.emails[0].value,
                pwd         : '',
                name        : profile.displayName,
                create_date :  time.whatTime(),
                update_date :  time.whatTime()
            }).then((user)=>{                
                cb(null,user.ops[0]);
            }).catch(err=>{
                throw {
                    status : 'XXXx_db_research',
                    err_name : err.name,
                    err_msg : err.message
                } ;
            });
        }
    }).catch(err=>{
        throw {
            status : 'XXXx_db_research',
            err_name : err.name,
            err_msg : err.message
        } ;
    });
 
}));

module.exports = { passport,passport_google };