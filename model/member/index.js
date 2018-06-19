let all      = require('./mode_member');

module.exports = {
    // for route
    register     : all.member_register ,
    login        : all.member_login,    
    update       : all.member_update,
    userData     : all.member_userData,
}     

