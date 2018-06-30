class Member{
    // Member工廠
    static get Member(){
        return new Member();
    }

    constructor(){
        this.DB = require('../service/db_connect');
        this.configMongo = require('../../config/config').mongo_config;
        this.colMember = this.DB.getCol(this.configMongo.db,this.configMongo.collection_member);
        this.colOrder = this.DB.getCol(this.configMongo.db,this.configMongo.collection_member);
    }

    /**
     * 註冊新用戶,Insert data 進 mongodb
     * @param   {data} 新用戶資料.
     * @returns {obStatus} 回傳插入用戶後狀況.
    */
    async memberRegister(data){
        
        await this.colMember.insertOne(data).catch(err=>{
            throw {
                status : 'register_db_register',
                err_name : err.name ,
                err_msg  : err.message
            };            
        });
    
        return {
            status : 'register_db_register',
            msg : 'register successfully'
        } ;
    }

    /**
     * 用戶登入
     * @param   {data} 新用戶資料.
     * @returns {obStatus} 回傳用戶登入後狀況.
    */
    async memberLogin(data) {
    
        //取得用戶資料
        const user = await this.colMember.findOne({ email : data.email }).catch(err=>{
            throw {
                status : 'login_db_research',
                err_name : err.name,
                err_msg : err.message
            } ;
        });
        
        //判斷密碼正確?
        //回傳格式 { res : boolean , msg ?: string }        
        if(user){
            return data.pwd === user.pwd ? { res : true } : { res : false , msg : 'pwd 錯誤'}
        }else{
            return {
                res : false , 
                msg : '帳號錯誤'
            }
        }
    }

    /**
     * 用戶更新資料,可更新資料為[name,pwd]
     * @param   {data} 用戶要更新的資料.
     * @returns {obStatus} 回傳更新的狀況.
    */
    async memberUpdate(data){
             
        // 尋找並更新物件
        let user = await this.colMember.findOneAndUpdate({ email : data.email },{ $set : data }).catch(err=>{
            throw {
                status : 'update_db_findOneAndUpdate',
                err_name : err.name ,
                err_msg : err.err_msg
            } ;
        })
        
        //判斷更新是否成功
        return user.ok <= 0 ? {
            status : 'update_db_findOneAndUpdate',
            msg    : 'update failed!' 
        } : {
            status : 'update_db_findOneAndUpdate',
            msg    : 'update successfully!'
        } ;
    }

    /**
     * 取得用戶資料與訂單
     * @param   {req}  req..
     * @returns {obStatus} 回傳用戶資料
    */
    async memberData(data){
            
        //取得用戶資料
        const user = await this.colMember.findOne({ email : data }).catch(err=>{
            throw {
                status : 'userData_db_research',
                err_name : err.name,
                err_msg : err.message
            } ;
        });
        //取得用戶訂單資料
        const order = await this.colOrder.find({ member_id : data }).toArray().catch(err=>{
            throw {
                status : 'userData_db_findorder',
                err_name : err.name,
                err_msg : err.message
            } ;
        });        
    
        return order.length > 0 ? {
            email : user.email,
            name  : user.name,
            create_date : user.create_date,
            order  : order.length
        } : {
            email : user.email,
            name  : user.name,
            create_date : user.create_date,         
        };
    }
}

module.exports = Member ;