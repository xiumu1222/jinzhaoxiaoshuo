var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var compressing = require('compressing');
/* GET home page. */
router.get('/', function (req, res, next) {
  var fileType = req.query.fileType;
  var fileName = req.query.fileName;

  if (fileType == 1) {

    //直接访问文件进行下载
    res.redirect(path.join(__dirname, '../public/' + fileName));
  } else if (fileType == 2) {
    var filePath = path.join(__dirname, '../public');
    var filePathzip = path.join(__dirname, '../../public.zip');
    //文件压缩
    compressing.zip.compressDir(filePath, filePathzip)
      .then(() => {
        console.log('success');
        //以文件流的形式下载文件
        var stats = fs.statSync(filePathzip);
        var isFile = stats.isFile();
        if (isFile) {
          res.set({
            'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
            'Content-Disposition': 'attachment; filename=public.zip', //告诉浏览器这是一个需要下载的文件
            'Content-Length': stats.size  //文件大小
          });
          fs.createReadStream(filePathzip).pipe(res);
        } else {
          res.end(404);
        }
      })
      .catch(err => {
        console.error(err);
      });

  } else if (fileType == 3) {
    //读取文件内容后再响应给页面
    var filePath = path.join(__dirname, '../public/' + fileName);
    var stats = fs.statSync(filePath);
    var isFile = stats.isFile();
    if (isFile) {
      fs.readFile(filePath, function (isErr, data) {
        if (isErr) {
          res.end("Read file failed!");
          return;
        }
        res.set({
          'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
          'Content-Disposition': 'attachment; filename=' + fileName, //告诉浏览器这是一个需要下载的文件
          'Content-Length': stats.size  //文件大小
        });
        res.end(data)
      })
    } else {
      res.end(404);
    }
  } else {
    res.end(404);
  }
});

module.exports = router;