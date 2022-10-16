<!-- 导航栏子路由页面-->
<template>
  <div style="background: #334157;">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="20">
        <el-menu :default-active="$route.path"
                 mode="horizontal"
                 background-color="#334157" text-color="#fff" active-text-color="#ffd04b"
                 style="margin-left: 15%"
                 router>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/personhelp">同城帮扶</el-menu-item>
          <el-menu-item index="/publicproject">公益项目</el-menu-item>
          <el-menu-item index="/record">捐款记录</el-menu-item>
          <el-menu-item index="/personfinished">已结束活动</el-menu-item>
        <el-menu-item index="/mychild"  v-show="!isLogin">我的儿童</el-menu-item>
          <el-menu-item index="/myapply" v-show="!isLogin">我的活动</el-menu-item>
          <el-menu-item index="/space">爱心空间</el-menu-item>
          <el-menu-item index="/news">资讯平台</el-menu-item>
          <el-menu-item @click="shouChange" v-show="!isLogin">修改密码</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="4">
        <div class="otherMenu">
          <el-menu mode="horizontal" background-color="#334157" v-show="isLogin" router>
            <el-menu-item v-for="menu in notLoginMenu" :key="menu.id" :index="menu.url">{{ menu.name }}</el-menu-item>
          </el-menu>
          <el-menu mode="horizontal" background-color="#334157" v-show="!isLogin">
            <el-menu-item index="21" @click="logout">退出</el-menu-item>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-menu-item index="1" style="color: #ffffff">欢迎您：{{ userName }}</el-menu-item>
              </span>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/mychild"><el-dropdown-item>我的儿童</el-dropdown-item></router-link>

                <router-link to="/myapply"><el-dropdown-item>我的活动</el-dropdown-item></router-link>
                <router-link v-if="isAdmin" to="/manage/"><el-dropdown-item>后台管理</el-dropdown-item></router-link>

              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="adminRegister" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form  ref="adminRegisterForm" :model="changePass">
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="changePass.password" autocomplete="off" type="password">
            <i slot="suffix" class="el-input__icon el-icon-view" ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="重复密码" :label-width="formLabelWidth" prop="repeatPassword">
          <el-input v-model="changePass.repeatPassword" autocomplete="off" type='password'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { menus, notLogin } from '../constant/data'
  import { getCookie } from '../utils/util'
  import {changePass, getCurrentUser, register} from "../service/api";
  export default {
    name: 'headnav',
    inject: ['reload'],
    data () {
      return {
        // 导航栏菜单
        menus: [],
        // 未登录菜单
        notLoginMenu: [],
        isLogin: false,
        isAdmin: false,
        dialogFormVisible:false,
        changePass:{},
        formLabelWidth: '120px',
      }
    },
    created () {
      this.menus = menus
      this.notLoginMenu = notLogin
      this.init()
    },
    computed: {
      // 计算userName的值
      userName () {
        if (this.$store.state.user) {
          if (typeof (this.$store.state.user) === 'object') {
            return this.$store.state.user.username
          } else {
            return JSON.parse(this.$store.state.user).username
          }
        } else {
          // this.$message('请重新登录')
        }
      }
    },
    methods: {
      shouChange(){
        console.log("点击")
        this.dialogFormVisible=true;
      },
      changePassword(){
        if(this.changePass.password==null||this.changePass.password==''){
          this.$message({
            type: 'error',
            message: '请输入新密码'
          });
        }else if(this.changePass.password!=this.changePass.repeatPassword){
          this.$message({
            type: 'error',
            message: '两次密码输入不一致'
          });
        }else{
          changePass(this.changePass.password).then(re => {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.dialogFormVisible = false

          })
        }
      },
      init () {
        let flag = getCookie('token')
        flag === null ? this.isLogin = true : this.isLogin = false
        if(flag){
          getCurrentUser(null).then(res => {
           if(res.type=='BACKEND'){
             this.isAdmin=true;
           }
          }).catch(e => {
            this.logining = false
          })
        }
      },
      // 退出登录
      logout () {
        //delCookie('token')
        // this.reload()
        this.$store.commit('logout')
        this.isLogin = true
        this.$router.push("/home")
      },
    }
  }
</script>
<style scoped>
  .otherMenu .el-menu--horizontal>.el-menu-item{
    color: rgb(255, 255, 255);
    border-bottom: solid 0px #e6e6e6;
  }
  /* 导航栏border设置为0px*/
  .row-bg .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
</style>
