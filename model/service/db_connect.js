let mongo = require('mongodb').MongoClient;
let mongoID = require('mongodb').ObjectId;

let _db = {};

const dbConnect = async (url)=> {
    _db = await mongo.connect(url);
    /*
    _db.on('close',(reason)=>{
        console.log('db closed');
    });   
     */
}

const getDB = ()=>{ return _db };
const getCol = (db,col) =>{return _db.db(db).collection(col)};
const closeDB = ()=>{ return _db.close(); };



module.exports = { getDB , dbConnect ,mongoID , getCol , closeDB };

// 沒連到網卡,本身無法開啟localhost:27017