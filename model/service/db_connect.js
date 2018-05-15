let mongo = require('mongodb').MongoClient;
let mongoID = require('mongodb').ObjectId;

let _db = {};

const dbConnect = async (url)=> {
    _db = await mongo.connect(url);
    _db.on('close',(reason)=>{
        console.log('db closed');
    });    
}

const getDB = ()=>{ return _db };


module.exports = { getDB , dbConnect ,mongoID };