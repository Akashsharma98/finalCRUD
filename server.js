const dotenv = require('dotenv');
dotenv.config();

const AppError = require('./utils/appError');

const express = require('express');
const app = express();

const userRouter = require("./api/user/user.router");//yha par user.router ko import kiya gya hai sara data
const errorController = require('./utils/errorController');
//sara data useRouter me save kiya gya hai 
app.use(express.json());



app.use("/api/user",userRouter);
/*app.get("/",(req,res)=> {
    res.json({
        success:1,
        massage: 'this rest api is working'
    })
});*/

//ERROR HANDEL
// app.all('*', (req, res) => {
//     const err = new Error(`Requested URL ${req.path} not found!`);
//     res.status(404).json({
//       success: 0,
//       message: err.message,
//       stack: err.stack,
//     });
//   })
app.use((req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} not found!`);
    //err.statusCode = 404;
    next(err);
 });

app.use(errorController);

  
    
app.listen(process.env.PORT ,() => {
    console.log(`server running on  ${process.env.PORT}`);    
}) ;
    
