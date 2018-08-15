const express = require('express')
const router = express.Router()
const query = require("../utils/db.js")

// const connection = db.connection()

router.route('/').post(function (req, res, next) {
  const param = req.body;
  if (param && param.username && param.pass) {
    const selectSql = `SELECT * FROM users where name="${param.username}"`
    query(selectSql, function (data) {
      if (data.results && data.results.length > 0) {
        
        req.session.regenerate(function (err) {
          if (err) {
            return res.json({ code: -1, msg: "登录失败", data: {} })
          }
          if (data.results[0].password != param.pass) {
            return res.json({ code: -1, msg: "用户名或密码不正确", data: {} })
          }
          req.session.username = param.username;
          res.json({ ret_code: 0, ret_msg: '登录成功' });
        })
      } else {
        res.json({ code: -1, msg: (data.error && data.error.message) || '用户名或密码不正确', data: {} })
      }
    })
  } else {
    res.json({ code: 0, msg: "请输入用户名和密码", data: {} })
  }
})

module.exports = router;