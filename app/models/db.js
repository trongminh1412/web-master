var q = require("q"); // khai báo promise
const { Pool, Client } = require('pg')

// ============================== KẾT NỐI SQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'QuanLy',
    password: 'minh0love',
    port: 5432,
})


// Kiểm tra EMAIL
const getUserByEmail =  function (email){
  if(email){
      var defer = q.defer();

      pool.query('SELECT * FROM public."user" WHERE email = $1', [email], (err, dulieu) => {
          if(err){
              defer.reject(err);

          }else{

              defer.resolve(dulieu);
          }
      })
      return defer.promise;
  }
  return false;
}

// lấy thông tin user
const getUser =  function (user){
  if(user){
      var defer = q.defer();

      pool.query('SELECT * FROM public."user" WHERE id = $1', [user], (err, dulieu) => {
          if(err){
              defer.reject(err);

          }else{

              defer.resolve(dulieu);
          }
      })
      return defer.promise;
  }
  return false;
}



module.exports.pool = pool;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUser = getUser;