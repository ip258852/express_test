// express related ==============
const express = require('express');
const app  = express();
// controler related ==============
const router = require('./controller/router/index');
// toollllll
const session = require('express-session');
const mongostore = require('connect-mongo')(session);
const responseTime = require('response-time');
const passport = require('./model/service/passport');
const db = require('./model/service/db_connect');
// init db
(async()=>{
    await db.dbConnect('mongodb://localhost:27017');    
    console.log('app db open')
})()
 
//app config related ==============
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
// set req參數
app.use((req,res,next)=>{
    if(!req.db) req.db=db;
    next();
})

app.use('/js',express.static('view/script')); 
app.use(passport.passport.initialize());
app.use(passport.passport.session());
 
// routes
app.use('/api/v1',router.member);
app.use('/api/v1',router.product);
app.use('/',router.basic);

app.get('/test', (req,res)=>{     
    res.end();
})

app.listen(3000,()=>{
    console.log('chart is online~');    
});
