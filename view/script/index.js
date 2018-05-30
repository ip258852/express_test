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
            $('.update_Data').remove();
            $('.main').append(`<h1 id='update_msg'>更改成功!!!!`);
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
        },
        error   : ()=>{
                $('.update_Data').append(`<h1 id='update_msg'>更改失敗!!!!`);        
        }                
    });
}
