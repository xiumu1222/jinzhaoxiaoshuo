<template>
  <div class="login">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('signin')">登录</el-button>
        <el-button @click="submitForm('signup')">注册</el-button>
        <el-button @click="getBook(1)">抓取1</el-button>
        <el-button @click="getBook(2)">抓取2</el-button>
        <el-button @click="getBook(3)">抓取3</el-button>
        <a href="http://localhost:8080/my/download?fileType=2&fileName=OCX(1).rar">下载</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: "",
        pass: "",
        checkPass: ""
      }
    };
  },
  methods: {
    submitForm(type) {
      const me = this;
      const params = me.ruleForm;
      me.$http.post(`/${type}`, params).then(res => {
        if(res && res.data && res.data.code==0){
        }
      });
    },
    download(){

    },
    getBook(type){
      this.$http.get(`/getbook?type=${type}`).then(res => {
        
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login {
  width: 400px;
  margin: 0 auto;
  margin-top: 200px;
}
</style>
