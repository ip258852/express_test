let member = require('./member_model');

module.exports = {
    register : member.member_register ,
    login    : member.member_login,
    update   : member.member_update
}