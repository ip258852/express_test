function logout(){
    $.get('/logout',(data,status)=>{
        window.location.reload();
    });     
}

function add_Update_Table(){
    $('.main').children().remove();

    $('.main').append(`
        <div class='update_Data'>            
            使用者   : <input type="text", name="name" class='update_Data_0'><br>
            密碼     : <input type="text", name="pwd" class='update_Data_1'><br>
            密碼重複 : <input type="text", name="re-pwd" class='update_Data_2'><br>
            <button onclick='submit_update_user()'>送出</button>
        </div>
    `);     
}

function submit_update_user(){
    let atr = ['name','pwd','rePwd'];
    let data = new Array();
    
    // 資料封裝
    const q_data = atr.map((val,ind)=>{
        data.push($(`.update_Data_${ind}`).val());        
        return val; 
    }).reduce((sum,val,index)=>{
       return index==1 ? `${sum}=${data[0]}&${val}=${data[1]}` : `${sum}&${val}=${data[index]}`;
    });
   
    $.ajax({
        type    : 'PUT',
        url     : '/api/v1/members' ,
        data    : q_data ,     
        success : ()=>{
            $('.main').children().remove();
            $('.main').append(`<h1>更改成功!!!!`);
        },
        error   : ()=>{
            if($('#update_msg').length==0){
                $('.update_Data').append(`<h1 id='update_msg'>更改失敗!!!!`);
            }            
        }
    });
}

function get_user_data(){
    $('.main').children().remove();
    $.ajax({
        type    : 'get',
        url     : '/api/v1/members' ,  
        success : (data)=>{
            $('.main').append(`
                <p>email : ${data.email}</p>
                <p>name : ${data.name}</p>
                <p>create_date : ${data.create_date}</p>
            `);
            get_order_data();
        },
        error   : ()=>{
                $('.main').append(`<h1>${err}`);        
        }                
    });
}

function get_product_data(event){
    $('.main').children().remove();
    $.ajax({
        type    : 'get',
        url     : '/api/v1/products' ,
        success : (data)=>{

            if(event){
                $('.main').append(`                
                    <h1>購物失敗,請再來一次</h1>        
                `);
            }

            data.forEach(element => {
                $('.main').append(`
                    <div class='${element.product_id}'>
                        <h3> $$ ${ element.name } $$ </h1>
                        <p id=cnt_${element.product_id}>  數量 : ${ element.quantity } </p> 
                        <p>  價格 : ${ element.price }  </p> 
                        <p>  備註 : ${ element.remark } </p> 
                        <p>  ----------------------- </p>
                        <input id='inc_${element.product_id}' type='button' value='+' onclick='add_val(${element.product_id},${element.quantity})'>
                        <input id='val_${element.product_id}' type='input' value='0'  style=' width : 40px ; text-align:center ' readonly="readonly">
                        <input id='dec_${element.product_id}' type='button' value='-' onclick='dec_val(${element.product_id})'>
                    </div>        
                `);  
            });  
            
            $('.main').append(`                
                    <br>
                    <button onclick='checkout()'> 結帳 </button>
            `);  
        },
        error   : (err)=>{
            $('.main').append(`<h1>${err}`);        
        } 
    })
}

function add_val(id,cnt){
   
    let now = parseInt($(`input#val_${id}`).val());
    
    if(now < cnt){     
        now++;
        $(`input#val_${id}`).val(now);
    }
}

function dec_val(id){
    let now = parseInt($(`input#val_${id}`).val());
    
    if(now > 0){     
        now--;
        $(`input#val_${id}`).val(now);
    }
}

function checkout(){
    let data = {};

    for( let i = 1 ; i < $('.main div').length+1 ; i++ ){
                    
        const val = parseInt($(`input#val_${i}`).val());
        if(val != 0){
            data[i] = val ;
        } 
    };
     
    $.ajax({
        type    : 'POST',
        url     : '/api/v1/orders' ,
        data    :  data,     
        success : (data)=>{
           $('.main').children().remove();
           $('.main').append(`<p>${data.status}</p>`);
        },
        error   : (err)=>{
            get_product_data(true);
        }
    });
}

function get_order_data(event){
    if(event){
        $('.main').children().remove();
    }
    
    $.ajax({
        type    : 'GET',
        url     : '/api/v1/orders' ,             
        success : (data)=>{        
           $('.main').append(`<p>order : ${data.length}</p>`);           
        },
        error   : (err)=>{
            get_product_data(true);
        }
    });
}