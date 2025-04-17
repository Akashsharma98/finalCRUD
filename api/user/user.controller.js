const { create, getUserByUserId, getUsers, updateUser, deleteUser, getUserByName, updateSessionData } = require("../user/user.service")
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

//const { token } = require("../../auth/sessionid");




module.exports = {
    createUser:  (req, res) => {

        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);


        // create session id
        const session_Id = sign({ name: body.name }, "qw123", {
            expiresIn: "1d",
        });
        body.session_Id = session_Id;

        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    massage: "data base connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                massage: "data connect",
                data: results,
                token: session_Id

            })

        })
    },
    getUserByUserId: catchAsync(async (req, res,next) => {
       
            const id = req.params.id;
            const result = await getUserByUserId(id);
            if (!result) {

                throw new AppError('record not found ', 404)// jaha jaha return me error hoga waha hamko throw error dena hai aur next ko call akrna hai
                // return res.json({
                //     success: 0,
                //     message: 'record not found'
               // });
            }
            return res.json({
                success: 1,
                data: result
            });

        // } catch (e) {                       // caod ko chhota dikha k liye catch async ka use kiya try catch hat jata hai 
        //    next(e)
        //     // res.status(400).json({
        //     //     success: 0,
        //     //     message: e.message,
        //     //     data: "something wrong "

        //     // })
           
        
    }),
    getUsers: catchAsync(async (req, res,next) => {
       // try {
            const body = req.body;
            const result = await getUsers();
            return res.json({
                success: 1,
                data: result
            });

        // } catch (e) {
        //     return res.json({
        //         success: 1,
        //         data: "something wrong"
        //     });
       // }
    }),
    //   getUsers((err,results)=>{
    //     if(err){
    //         console.log(err)
    //         return;
    //     }
    //     return res.json({
    //             success:1,
    //             data:results
    //         });
    //     });          
    // },
    updateUser: async (req, res,next) => {
        try {
            const body = req.body;
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);

            // create session id
            const session_Id = sign({ name: body.name }, "qw123", {
                expiresIn: "1d",
            });
            // Add session_Id to body
            body.session_Id = session_Id;
           // const result = await updateUser(body);
            const result = await updateUser(body);
            if (!result || result.affectedRows === 0) {
                return res.status(404).json({
                    success: 0,
                    message: 'User not found or update failed',
                });
            }
    

            return res.json({
                success: 1,
                message: 'update success',
                token: session_Id

            })

        } catch (e) {
        next(e)                               // same error dega ham next e functione tab call karega jo ham global error banaye hai 
        //     return res.status(500).json({
        //         success: 0,
        //         message: 'update not',
        //         error: e.message

        //  });
          

        }
    },


    //     updateUser(body,(err,results)=> {
    //         if(err){
    //             console.log(err);
    //             return
    //         }
    //         return res.json({
    //             success:1,
    //             message:'update success'
    //         });
    //     });
    // },

    deleteUser: (req, res) => {                  // agar ham delate user me try catch chahe to sabse pahle service me 
                                                  //  promise ka use karenge jisme resolve reject hoga           
        const id = req.params.id;                 // error reject resolve me result copy 
       const data = { id: id };                // contrl me async call kark breack me try catch likhenge 


       //const data = req.body;                  // isko hatane k liye ham await lik denge

        deleteUser(data, (err, results) => {     //  const result = await deletUser(data);

            console.log(data)                     // catch me ham return wala data denge 
            if (err) {
                console.log(err)                  // try me if aur return dono 
                return
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: 'record not fond'
                })
            }
            return res.json({                     // catch me jayega success 0 message  not delated 
                success: 1,                        //error = e.message
                message: 'deleted'
            });
        });
    },

    login: (req, res) => {
        const body = req.body;
        getUserByName(body.name, (err, results) => {

            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: 'data not found'
                })
            }
            // console.log("body.password",body.password,"results.password)
            const result = compareSync(body.password, results.password);
            console.log("User password:", body.password);
            console.log("Hashed password from DB:", results.password);

            if (!result) {
                return res.json({
                    success: 0,
                    message: "Invalid password"
                });
            }

            if (results) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, "qw123", {
                    expiresIn: '1d'


                });

                updateSessionData(results.id, jsontoken, (err, updateRes) => {
                    if (err) {
                        console.log("Token save error:", err);
                        return res.json({
                            success: 0,
                            message: 'Token update failed'
                        })
                    }
                    return res.json({
                        success: 1,
                        message: 'login',
                        token: jsontoken,



                    })

                })
            } else {
                res.json({
                    success: 0,
                    message: 'no login'

                })
            }
        })
    },

};
/* login: (req, res) => {
     const body = req.body;
 
     getUserByName(body.name, (err, results) => {
         if (err) {
             console.log(err);
             return res.json({
                 success: 0,
                 message: 'Database error'
             });
         }
 
         if (!results) {
             return res.json({
                 success: 0,
                 message: 'Data not found'
             });
         }
 
         const result = compareSync(body.password, results.password);
 
         if (!result) {
             return res.json({
                 success: 0,
                 message: 'Invalid password'
             });
         }
 
         // ✅ Password matched
         results.password = undefined;
         const jsontoken = sign({ result: results }, "qw123", {
             expiresIn: '1h'
         });
 
         // ✅ Save token and update last_login
         updateSessionData(results.id, jsontoken, (err, updateRes) => {
             if (err) {
                 console.log("Token save error:", err);
                 return res.json({
                     success: 0,
                     message: 'Token update failed'
                 });
             }
 
             return res.json({
                 success: 1,
                 message: 'Login successful',
                 token: jsontoken
             });
         });
     });
 }*/
