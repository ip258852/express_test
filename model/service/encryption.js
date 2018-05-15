let cry = require('crypto');

module.exports = (passwd) => {
    const hashPwd = cry.createHash('sha1');
    hashPwd.update(passwd);
    return hashPwd.digest('hex');
}