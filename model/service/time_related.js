const whatTime = ()=>{
    let date = new Date();
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = { whatTime }