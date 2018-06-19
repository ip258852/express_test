let config = require('../../config/config');
let mongoID = require('mongodb').ObjectID;

module.exports = async (req,query)=>{
    
    const col_order = req.db.getCol(config.mongo_config.db,config.mongo_config.collection_order);
    const col_pro   = req.db.getCol(config.mongo_config.db,config.mongo_config.collection_product);

    const order = await col_order.findOne({ _id : new mongoID(query)}).catch( err=>{throw err} );
    await col_pro.update({ 
        product_id : order.product_id 
    },{
        $inc : {
            quantity : order.quantity
        }
    }).catch( err=>{throw err} );
    
    const ans = await col_order.deleteOne({ _id : new mongoID(query)}).catch( err=>{throw err} );

    return ans.result.n ==1 ? 'yes' : 'No';
}

