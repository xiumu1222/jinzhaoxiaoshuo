const express = require('express')
const router = express.Router()
const query = require("../utils/db.js")

// const connection = db.connection()

router.route('/').post(function (req, res, next) {
  const param = req.body;
  if (param && param.username && param.pass) {
    const selectSql = `SELECT * FROM users where name="${param.username}"`;
    query(selectSql, function (data) {
      if (data.results && data.results.length == 0) {
        next()
      } else {
        res.json({ code: -1, msg: data.message || '您注册的用户名已存在', data: {} })
      }
    })
  } else {
    res.json({ code: 0, msg: "请输入用户名和密码", data: {} })
  }
}).post(function (req, res, next) {
  const param = req.body;
  const date = new Date()
  const addSql = `INSERT INTO users(name,password) VALUES("${param.username}","${param.pass}")`;
  query(addSql, function (data) {
    if (data.results) {
      res.json({ code: 0, msg: "成功", data: {} })
    } else {
      res.json({ code: -1, msg: data.message, data: {} })
    }
  })
})

module.exports = router;