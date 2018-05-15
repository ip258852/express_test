// express related ==============
let express = require('express');
let app  = express();
// controler related ==============
let member_r = require('./controller/router/member_route');
let product_r = require('./controller/router/product_route');

let body_p = require('body-parser');
 
//app config related ==============
app.use(body_p.urlencoded({extended : false}));

app.use('/api/v1',member_r);
app.use('/api/v1',product_r);
  

app.listen(3000,()=>{
    console.log('chart is online~');
});