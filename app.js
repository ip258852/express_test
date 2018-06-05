// express related ==============
let express = require('express');
let app  = express();
// controler related ==============
let router = require('./controller/router/index');
// toollllll
let session = require('express-session');
const mongostore = require('connect-mongo')(session);
const responseTime = require('response-time');

//app config related ==============
 
app.set('view engine','jade');
app.set('views',`${__dirname}/view`);

// middleware
app.use(responseTime());
app.use(express.urlencoded({extended : false}));
app.use(session({
    secret : '12345678974165789',
    store  : new mongostore({url : 'mongodb://localhost:27017/chart'}),
    cookie : {maxAge : 60*100000 , httpOnly: true },
    resave : true,
    saveUninitialized : true
}));

// routes
app.use('/js',express.static('view/script'));
app.use('/api/v1',router.member);
app.use('/api/v1',router.product);
app.use('/',router.basic);

app.get('/test',(req,res)=>{
    res.send('123456')
})

app.listen(3000,()=>{
    console.log('chart is online~');
});