// ========= express related ==============
const https = require('https');
const express = require('express');
const app  = express(); 
const router = require('./controller/router/Routers');
// toollllll
const session = require('express-session');
const mongostore = require('connect-mongo')(session);
const responseTime = require('response-time');
const Passport = require('./model/service/passport');
const DB = require('./model/service/db_connect');
const fs = require('fs');

// ========== init ===========
(async()=>{
    await DB.init('mongodb://localhost:27017');
    console.log('app db open');
    // init product
    const config = require('./config/config');
    const data = require('./config/product');
    const p_col = DB.getCol(config.mongo_config.db,config.mongo_config.collection_product);
    const re = await p_col.find({}).toArray();
    re.length>0 ?  0 : await p_col.insertMany(data);
    // passport init 
    Passport.init();
})();
const https_opt = {
    key  : fs.readFileSync('./static/private.key'),
    cert : fs.readFileSync('./static/mycert.crt')
}

//=========== app config related ==============
app.set('view engine','jade');
app.set('views',`${__dirname}/view`);

// middleware
app.use(responseTime());
app.use(express.urlencoded({extended : false})); 
app.use(session({
    secret : '12345678974165789',
    store  : new mongostore({url : 'mongodb://localhost:27017/chart'}),
    cookie : {maxAge : 60*10000000, httpOnly: true },
    resave : true,
    saveUninitialized : true
})); 
 
app.use('/js',express.static('view/script')); 
app.use(Passport.initialize());
app.use(Passport.session());

// routes
app.use('/api/v1',router.init);
app.use('/',router.initB);
 
https.createServer(https_opt,app).listen(3001,()=>{
    console.log('https schart is online~')
});

/*
    app.post('/test', (req,res)=>{        
        res.end();
    })
    
    app.listen(3000,()=>{
        console.log('http chart is online~');    
    });

*/
