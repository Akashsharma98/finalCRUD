const sendErrorDev = (err,res)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:0,
        stack: err.stack,
        message:err.message
    })
}

const sendErrorprod= (err,res)=>{
    const statusCode = err.statusCode || 500;
    if(isOprational){
        res.status(statusCode).json({
            success:0,
            message:err.message,
           
        })
    } else{
        res.status(statusCode).json({
            success:0,
            message:"somthing  wrong",
        
        })
    }      
}



module.exports = (err,req,res,next)=>{
    if(process.env.NODE_env==='dev'){
 sendErrorDev (err,res);
     }else{
        sendErrorprod(err,res)
    }
    // const statusCode = err.statusCode || 500;
    // res.status(statusCode).json({
    //     success:0,
    //     message:err.message,
    //     stack: err.stack
    // })

}