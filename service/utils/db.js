
//使用mysql组件库
const mysql = require('mysql');

//创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mydb'
})

//使用数据库连接池
const query = function (sql, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('数据库连接池连接失败')
      callback(err);
    } else {
      conn.query(sql, function (error, results, fields) {
        if (error) {
          console.log('数据库访问出错', error)
        } else {
          console.log('数据库访问成功', results)
        }
        callback({ error, results });
      })
    }
  })
}

module.exports = query;












// let db = {};

// //插入操作，注意使用异步返回查询结果
// db.insert = function (connection, sql, paras, callback) {
//   connection.query(sql, paras, function (error, results, fields) {
//     if (error) {
//       console.log('数据库访问出错', error)
//     } else {
//       console.log('数据库访问成功', results)
//     }
//     callback({ error, results });
//   });
// }

// //查询操作
// db.select = function (connection, sql, callback) {
//   connection.query(sql, function (error, results, fields) {
//     if (error) {
//       console.log('数据库访问出错', error)
//     } else {
//       console.log('数据库访问成功', results)
//     }
//     callback({ error, results });
//   });
// }

// //查询数据
// db.query = function (connection, sql, paras, callback) {

// }

// //连接数据库
// db.connection = function () {
//   //数据库配置
//   var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123456',
//     database: 'mydb'
//   });
//   //数据库连接
//   connection.connect(function (err) {
//     if (err) {
//       console.log(err);
//       return;
//     } else {
//       console.log('数据库连接成功')
//     }
//   });

//   return connection;
// }

// //关闭数据库
// db.close = function (connection) {
//   //关闭连接
//   connection.end(function (err) {
//     if (err) {
//       return;
//     } else {
//       console.log('关闭连接');
//     }
//   });
// }

// module.exports = db;