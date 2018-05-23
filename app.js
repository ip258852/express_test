// express related ==============
let express = require('express');
let app  = express();
// controler related ==============
let member_r = require('./controller/router/member_route');
let product_r = require('./controller/router/product_route');

let body_p = require('body-parser');
 
//app config related ==============
 
app.set('view engine','jade');
app.set('views',`${__dirname}/view`);

app.use(body_p.urlencoded({extended : false}));

app.use('/api/v1',member_r);
app.use('/api/v1',product_r);

app.get('/',(req,res)=>{
    res.render('index.jade');
});
app.get('/register',(req,res)=>{
    res.render('register.jade');
});

app.listen(3000,()=>{
    console.log('chart is online~');
});