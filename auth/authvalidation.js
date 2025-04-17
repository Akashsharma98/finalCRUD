const joi = require('joi')

// const createValidation = (req,res,next) =>{
//     const schema = joi.object({
//         name : joi.string().min(3).max(10).required(),
//         //age: joi.string().min(2).max(3).required(),
//         age: joi.number().min(1).max(3).required(),
//         password: joi.string().min(4).max(10).required(),
//         adress: joi.string().min(4).max(20).required(),
//     });
//     const error = schema.validate(req.body)//        error{error,value}
//     if(error){
//         console.log('errore--==-',error)
//         return res.status(400).json({
//             status:false,
//             message:'bed request'
//         })
//     }
//req.body = value;  // This stores the validated data back in req.body error aya

//     next()
// }

const createValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(10).required(),
        age: joi.number().min(1).max(3).required(),
        password: joi.string().min(4).max(10).required(),
        adress: joi.string().min(4).max(20).required(),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body);

    // If there's an error in validation
    console.log(value,'Error --', error);
    if (error) {
        return res.status(400).json({
            status: false,
            message: 'Bad request',
            error: error.details // You can return more details about the validation error here
        });
    }

    // If no error, pass the validated data to the next middleware
    req.body = value;  // This stores the validated data back in req.body
    next();
}

const loginValidation = (req,res,next) =>{
    const schema = joi.object({
        name : joi.string().min(3).max(10).required(),        
        password: joi.string().min(4).max(10).required(),
       
    });
    const { error, value } = schema.validate(req.body);

    console.log(value,'Error --', error);
    if (error) {
        return res.status(400).json({
            status: false,
            message: 'Bad request',
            error: error.details // You can return more details about the validation error here
        });
    }

     req.body = value;  // This stores the validated data back in req.body
    next();
}
module.exports={createValidation,loginValidation};