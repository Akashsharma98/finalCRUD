const pool = require("../../config/database");
// const { getUserByUserId, getUsers,getUserByName } = require("./user.controller");



/*module.exports={
    create: (data,callback) => {
        pool.query(
            `insert in to student(name,age,password,adress)
            values(?,?,?,?)`,
            [
                data.name,
                data.age,
                data.password,
                data.adress,
            ],
            (error,result,fields)=>{
                if(error){
                    return callback(error);

                }return callback(null,result)
            }
            );
            
            
        
    }
}*/
module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT INTO student (name, age, password, adress ,session_Id) 
            VALUES (?, ?, ?, ? ,?)`,
            [ 
                data.name,
                data.age,
                data.password,
                data.adress,
                data.session_Id // Ensure the spelling here matches the column name in your database
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getUserByUserId: (id)=>{
        return new Promise((resolve, reject) => {
        pool.query
        (`select id ,name,age,password,adress,session_Id from student where id=?`,
            [id],
            (error,results,fields)=>{
                if(error){
                  return   reject(error)
                }
                return resolve(results[0])

            }
        )
    });
},
    getUsers : () => {
          return new Promise((resolve, reject) => {
            pool.query(
                `select id,name,age,password,adress,session_Id from student`,
                [],
                (error,results,fields)=>{
                    if(error){
                        return reject(error);                    
                    }
                    return resolve( results);
                    }
                );  
        })
    },
    updateUser: (data) => {
        return new Promise((resolve, reject) => {
        pool.query
        (`update student set name=?, age=?, password=?,session_Id = ? ,adress=? where id=?`,
            [
                data.name,
                data.age,
                data.password,
                data.session_Id,
                data.adress,
                data.id
            ],
            (error,result,fields) => {
                if(error){
                    return reject(error);
                }
                return resolve(result);
            }
        )
    });
},
    deleteUser: (data ,callback)=>{

        pool.query(
            `DELETE FROM student WHERE id = ?`,

            [data.id],
            (error,results, fields)=>{
                if(error){
                 return   callback(error);
                }
                return callback(null,results);
            }
        );
    },
    getUserByName :(name,callback)=>{
        pool.query(

            `select * from student where name = ?`,
            [name],
            (error,results,field)=>{
                if (error){
                   return callback(error);

            }
            return callback(null, results[0]);

            }
        )
        
        },
        updateSessionData: (id, token, callback) => {
            pool.query(
                `UPDATE student SET session_Id = ?, last_login = NOW() WHERE id = ?`,
                [token, id],
                (error, results) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, results);
                }
            );
        }
                
    }
    

