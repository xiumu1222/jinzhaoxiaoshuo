// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import axios from 'axios';
import qs from "qs";
import router from './router'

const BASEURL = '/my'
Vue.prototype.$http = axios.create({
  baseURL: BASEURL,
  headers: {
    post: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;//default
  },
  transformRequest: [function (data) {
    data = qs.stringify(data)
    return data
  }],
  transformResponse: [function (data) {
    try {
      data = JSON.parse(data)
      if (data.code === 2170914 || data.code === 2183170) {
        //window.location.reload()
      } else if (data.code === '0x00235005') {
        Vue.prototype.$message.error({
          showClose: true,
          duration: 0,
          message: data.msg
        })
      } else {
        return data
      }
    } catch (error) {
      return data
    }

  }]
})

// 添加请求拦截器
Vue.prototype.$http.interceptors.request.use(function (config) {
  // 在发送请求之前做某事
  return config
}, function (error) {
  // 请求错误时做些事
  Vue.prototype.$message.error('服务器异常，请联系管理员！')
  return Promise.reject(error)
})

// 添加响应拦截器
Vue.prototype.$http.interceptors.response.use(function (response) {
  // 对响应数据做些事
  return response
}, function (error) {
  // 请求错误时做些事
  if (error && error.request && error.request.status === 0) {
    if (error.config.url.indexOf("loadapp") > -1) {
      Vue.prototype.$message.error('请求超时，请确认已安装播放器！')
    } else {
      Vue.prototype.$message.error('请求超时或服务器异常，请检查网络或联系管理员！')
    }
  } else {
    Vue.prototype.$message.error('服务器异常，请联系管理员！')
  }
  return Promise.reject(error)
})

//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz   
  var o = {
    "M+": this.getMonth() + 1,                 //月份   
    "d+": this.getDate(),                    //日   
    "h+": this.getHours(),                   //小时   
    "m+": this.getMinutes(),                 //分   
    "s+": this.getSeconds(),                 //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
