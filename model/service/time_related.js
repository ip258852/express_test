let whatTime = ()=>{
    let date = new Date();
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
let whatTime_opay = ()=>{
    let date = new Date();
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = { whatTime , whatTime_opay}