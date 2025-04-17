module.exports = (err,req,res,next)=>{

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:0,
        message:err.message,
        stack: err.stack
    })

}