let whatTime = ()=>{
    let date = new Date();
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = { whatTime }