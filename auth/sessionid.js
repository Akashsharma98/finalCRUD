
module.exports={
token:()=>{
    const data = Math.floor(1000 + Math.random() * 9000);
    if(NODE_ENV === 'dev'){
        return sign({check:data}, TOKEN_KEY,{
            expiresIn:TOKEN_EXPIRE_TIME
        });
    }else{
        return sign({check:data}, TOKEN_KEY,{
            expiresIn:TOKEN_EXPIRE_TIME
        });
    }
}

}


