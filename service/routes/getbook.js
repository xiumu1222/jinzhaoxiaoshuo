var express = require("express");
var router = express.Router();
const query = require("../utils/db.js");
// request
const request = require("request");
const iconv = require("iconv-lite");
// 类似jquery的一个库
const cheerio = require("cheerio");
// 文件管理模块
const fs = require("fs");
// 控制并发数
const async = require("async");
var baseUrl = "";
// var URL = "https://www.daizhuzai.com/10828/3.html";

var NUMBER = 0;
var start = new Date();

var OptionsArr = [];
var z = 270;
for (var m = 0 + z; m < 30 + z; m++) {
  var URL = `https://www.ybdu.com/book/postdate/0/${m}/`;
  // var cookie;
  // if(m%3==0){
  //   cookie = `adwinnum=5; Hm_lvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532602835,1532656769; cscpvrich8519_fidx=8; Hm_lpvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532658385`
  // }else if(m%3==2){
  //   cookie = `adwinnum=5; Hm_lvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532602835,1532656769; Hm_lpvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532660367; cscpvrich8519_fidx=6`
  // }else{

  // }
  var Options = {
    method: "GET",
    encoding: null,
    url: URL,
    timeout: 100000,
    rejectUnauthorized: false,
    gzip: true,
    headers: {
      Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
      "Accept-Encoding": `gzip, deflate, br`,
      "Accept-Language": `zh-CN,zh;q=0.9`,
      "Cache-Control": `max-age=0`,
      Connection: `keep-alive`,
      Cookie: `adwinnum=5; Hm_lvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532602835,1532656769; cscpvrich8519_fidx=8; Hm_lpvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532658385`,
      Host: `www.ybdu.com`,
      "If-Modified-Since": `Mon, 25 Jun 2018 15:21:24 GMT`,
      "If-None-Match": `W/"5b310874-7a95"`,
      "Upgrade-Insecure-Requests": 1,
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36`
    }
  };
  OptionsArr.push(Options);
}

router.get("/", function(req, res, next) {
  let b = req.query;
  let paramStr = "";
  if (b.type == 1) {
    //爬取所有书本
    async.mapSeries(
      OptionsArr,
      function(item, cb) {
        request(item, function(err, res, body) {
          if (err) {
            console.log("首页爬取失败");
            console.log(err);
            cb(err, "首页爬取失败");
            return;
          }
          // console.log("首页爬取成功,费时" + (new Date() - start) / 1000 + "秒");
          // 处理爬取的信息
          body = iconv.decode(body, "gbk");
          var $ = cheerio.load(body);
          var urldom = $(".clearfix.rec_rullist>ul");

          urldom.each(function(index, e) {
            var d = $(this);
            var dom = d.find("li");
            var _name = dom
              .eq(1)
              .text()
              .substring(
                0,
                dom
                  .eq(1)
                  .text()
                  .indexOf("全文阅读")
              );
            var _url = dom
              .eq(1)
              .find("a")
              .attr("href");
            var _author = dom.eq(3).text();
            var _wordnum = dom.eq(4).text();
            var _type = dom.eq(6).text();
            var _bid = _url.substring(
              _url.indexOf("xiaoshuo") + 12,
              _url.length - 1
            );

            paramStr += `("${_bid}","${_name}","${_url}","${_author}","${_wordnum}","${_type}")`;

            paramStr += `,`;
          });
          console.log(item.url + "爬取成功");
          // setTimeout(function(){
          cb(null, item.url + "爬取成功");
          // },1000)
        });
      },
      function(err, result) {
        if (paramStr && err == null) {
          paramStr = paramStr.substring(0, paramStr.length - 1);
          const addSql = `INSERT INTO books(bid,name,url,author,wordnum,type) VALUES${paramStr}`;
          query(addSql, function(data) {
            if (data.results) {
              console.log(data.results);
              // res.json({ code: 0, msg: "成功", data: {} });
            } else {
              console.log(data.message);
              // res.json({ code: -1, msg: data.message, data: {} });
            }
          });
        }
      }
    );
  } else if (b.type == 2) {
    //数据库读取所有书
    const searchSql = `SELECT * FROM books`;
    query(searchSql, function(data) {
      if (data.results && data.results.length > 0) {
        //遍历所有书
        async.mapSeries(
          data.results,
          function(item, cb1) {
            let bookObj = item;
            const url = bookObj.url;
            const option = {
              method: "GET",
              encoding: null,
              url: url,
              timeout: 100000,
              rejectUnauthorized: false,
              gzip: true,
              headers: {
                Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
                "Accept-Encoding": `gzip, deflate, br`,
                "Accept-Language": `zh-CN,zh;q=0.9`,
                "Cache-Control": `max-age=0`,
                Connection: `keep-alive`,
                Cookie: `adwinnum=5; Hm_lvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532602835,1532656769; cscpvrich8519_fidx=8; Hm_lpvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532658385`,
                Host: `www.ybdu.com`,
                "If-Modified-Since": `Mon, 25 Jun 2018 15:21:24 GMT`,
                "If-None-Match": `W/"5b310874-7a95"`,
                "Upgrade-Insecure-Requests": 1,
                "User-Agent": `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36`
              }
            };
            // 抓取文章所有章节
            request(option, function(err, res, body) {
              console.log(`开始爬取《${bookObj.name}》`);
              body = iconv.decode(body, "gbk");
              const $ = cheerio.load(body);

              bookObj.intro = $(".mu_contain>p").text();
              var modSql = `UPDATE books SET intro = "${
                bookObj.intro
              }" WHERE id = ${bookObj.id}`;
              query(modSql, function(data) {
                if (data.results && data.results.length > 0) {
                  // cb(null, "success");
                  console.log(`《${bookObj.name}》存入数据库成功`);
                } else {
                  console.log(`《${bookObj.name}》存入数据库失败`);
                }
              });
              fs.exists("./" + bookObj.bid, function(exists) {
                if (exists) {
                  console.log(
                    `《${bookObj.name}》创建目录${bookObj.bid}已存在`
                  );
                } else {
                  fs.mkdir("./" + bookObj.bid, function(err) {
                    if (err) {
                      throw err;
                    }
                    console.log(
                      `《${bookObj.name}》创建目录${bookObj.bid}成功`
                    );
                  });
                }
              });

              const urldom = $(".mulu_list>li>a");
              let bookPartObjs = [];
              urldom.each(function(index, e) {
                const bookPartObj = {
                  id: index,
                  url: $(this).attr("href"),
                  title: $(this).text()
                };
                bookPartObjs.push(bookPartObj);
              });
              console.log(`《${item.name}》章节获取成功`);

              async.mapSeries(
                bookPartObjs,
                function(item2, cb2) {
                  console.log(`《${item.name}》章节开始抓取`);
                  const option = {
                    method: "GET",
                    encoding: null,
                    url: url + item2.url,
                    timeout: 100000,
                    rejectUnauthorized: false,
                    gzip: true,
                    headers: {
                      Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
                      "Accept-Encoding": `gzip, deflate, br`,
                      "Accept-Language": `zh-CN,zh;q=0.9`,
                      "Cache-Control": `max-age=0`,
                      Connection: `keep-alive`,
                      Cookie: `adwinnum=5; Hm_lvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532602835,1532656769; cscpvrich8519_fidx=8; Hm_lpvt_a1b17bf301c6a7aa3a0ba9cce1414f7a=1532658385`,
                      Host: `www.ybdu.com`,
                      "If-Modified-Since": `Mon, 25 Jun 2018 15:21:24 GMT`,
                      "If-None-Match": `W/"5b310874-7a95"`,
                      "Upgrade-Insecure-Requests": 1,
                      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36`
                    }
                  };
                  //读取章节内容地址
                  request(option, function(err, res, body) {
                    console.log(
                      `《${item.name}》章节《${item2.title}》开始抓取`
                    );
                    console.log("我请求到数据了");
                    body = iconv.decode(body, "gbk");
                    const $ = cheerio.load(body);
                    // fs.writeFileSync(bookPartObjs[0].title+'.txt', $("script").eq(5), "utf-8");
                    let resJson = {};
                    resJson.content = body.substring(body.indexOf('<div id="htmlContent" class="contentbox">')+'<div id="htmlContent" class="contentbox">'.length,body.indexOf('<div class="ad00"><script>show_style();</script></div>'));

                    resJson.id = item2.id;
                    resJson.title = item2.title;
                    resJson.name = item.name;

                    resJson = JSON.stringify(resJson);
                    console.log(
                      `《${item.name}》章节《${item2.title}》开始写入`
                    );
                    fs.exists(`./${bookObj.bid}/${item2.id}.json`, function(
                      exists
                    ) {
                      if (exists) {
                        console.log(item2.title + "已存在");
                      } else {
                        fs.writeFileSync(
                          `./${bookObj.bid}/${item2.id}.json`,
                          new Buffer(resJson),
                          "utf8"
                        );
                        console.log(item2.title + "写入成功");
                      }
                    });

                    
                    cb2(null, "《${item.name}》章节《${item2.title}》写入成功");
                  });
                },
                function(err, results) {
                  cb1(null, "success");
                }
              );
            });
          },
          function(err, result) {}
        );
      } else {
      }
    });
  }
  res.end("success");
});

module.exports = router;
