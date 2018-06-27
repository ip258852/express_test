const mongo = require('mongodb').MongoClient;
const mongoID = require('mongodb').ObjectId;

// 沒連到網卡,本身無法開啟localhost:27017
class connectDB{
    constructor(){
        this._db;    
        this.mongoID = mongoID ;
    }

    async init(url){
        this._db = await mongo.connect(url);
    }

    getCol(db,col){
        return this._db.db(db).collection(col);
    }

    closeDB(){ 
        return this._db.close(); 
    };

    get getDB(){ 
        return this._db;
    };

    get getmongoID(){
        return this.mongoID;
    }
}

module.exports = new connectDB();