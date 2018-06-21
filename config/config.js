exports.mongo_config = {
    url : 'mongodb://localhost:27017',
    db  : 'chart',
    collection_member : 'members',
    collection_product : 'products',
    collection_order : 'orders',
    collection_googlemember : 'googlemembers'
}
 
exports.privateKey = '123456789' ;

exports.google_oath2 = {
    clientID : '225719223181-2b3i47eimktehsa25jolimsdkun5uqgt.apps.googleusercontent.com',
    clientSecret : 'HamGMPap4jg1qB6Ne9JbIJS8',
    callbackURL : '/api/v1/google/callback',
}

exports.fb_oath2 = {
    clientID: 193805557925277,
    clientSecret: '32a8dbb5c1daca67ea6f7550103e8dc3',
    callbackURL: "/api/v1/fb/callback",
}