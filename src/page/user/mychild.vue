<template>
  <div>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="我的儿童" name="first">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select v-model="search_param.status" placeholder="请选择状态">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="search_param.childName" placeholder="请输入儿童姓名"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" round @click="getMyChildList">搜索</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5" v-for="child in childList" :key="child.id" style="margin: 20px">
          <el-badge :value="child.statusName" class="item">
          <el-card>
            <div  @click="personDetail(child.id)">
              <el-image :src="child.filePath" lazy style="height: 179px; width: 200px;" fit="fill"/>
            </div>

            <div style="padding: 14px;">
              <div @click="personDetail(child.id)">
                <span> {{ child.childName }}</span>
              </div>

              <el-row class="cardGyDiv">
                <el-col :span="25">
                  <p>学校：{{ child.school }} </p>
                  <p>编号：{{ child.childCode }}</p>
                </el-col>
              </el-row>

              <el-row class="cardGyDiv">
                <el-col :span="16">
                  <el-button type="primary" icon="el-icon-edit" circle @click="personEdit(child.id)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle  @click="del(child.id)"></el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
          </el-badge>
        </el-col>
      </el-row>
      <Pagination :pageSize="this.search_param.size" :pageIndex="this.search_param.page" :total="total"
                  @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
    </el-tab-pane>
    <el-tab-pane label="添加儿童" name="second">
      <div style="text-align: center">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="upload">
          <img v-if="add_data.filePath" :src="add_data.filePath" class="avatar">
          <i  class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form label-position="right" label-width="120px" style="width: 100%;margin-top: 20px;text-align: center"  :model="add_data" ref="form" class="formClass">
          <el-form-item label='儿童姓名:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="add_data.childName" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='儿童性别:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-select v-model="add_data.childSex" placeholder="请选择" >
                <el-option
                  v-for="item in sex"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label='儿童年龄:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="add_data.childAge" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='城市:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-cascader v-model="add_data.city" :options="cities" ref="city"></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label='住址:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="add_data.address" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='学校:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="add_data.school" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='班主任名称:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="add_data.masterName" clearable></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label='学习成绩:' prop="content">
            <el-col>
              <QuillEditor @getContent="getScore" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-form-item label='健康状况:' prop="content">
            <el-col>
              <QuillEditor @getContent="getHealty" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>

          <el-form-item label='基本信息:' prop="content">
            <el-col>
              <QuillEditor @getContent="getBaseMessage" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>

          <el-form-item label='面临的困难:' prop="content">
            <el-col>
              <QuillEditor @getContent="getFace" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" style="float: right" @click="create">申请求助</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
  </el-tabs>

    <el-dialog title="儿童详情" width="80%" :visible.sync="dialogLookVisible">
      <el-descriptions class="margin-top"  :column="2" :size="size" border>
        <el-descriptions-item>
          <template slot="label">
            姓名
          </template>
          {{ detail_data.childName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            性别
          </template>
          {{ detail_data.childSex }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            年龄
          </template>
          {{ detail_data.childAge }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            城市
          </template>
          {{ detail_data.cityText[0] }}-{{detail_data.cityText[1]}}={{detail_data.cityText[2]}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            住址
          </template>
          {{ detail_data.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            学校
          </template>
          {{ detail_data.school }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            班主任姓名
          </template>
          {{ detail_data.masterName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            学习成绩
          </template>
          <p v-html="detail_data.score"></p>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            健康状况
          </template>
          <p v-html="detail_data.healthy"></p>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            基本信息
          </template>
          <p v-html="detail_data.baseMessage"></p>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            面临的困难
          </template>
          <p v-html="detail_data.faceDifficulty"></p>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="修改儿童" width="80%" :visible.sync="dialogEditVisible">
      <div style="text-align: center">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="upload2"
          <img v-if="detail_data.filePath" :src="detail_data.filePath" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form label-position="right" label-width="120px" style="width: 100%;margin-top: 20px;text-align: center"  :model="detail_data" ref="form" class="formClass">
          <el-form-item label='儿童姓名:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="detail_data.childName" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='儿童性别:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-select v-model="detail_data.childSex" placeholder="请选择" >
                <el-option
                  v-for="item in sex"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label='儿童年龄:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="detail_data.childAge" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='城市:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-cascader v-model="detail_data.city" :options="cities" ref="city_change" ></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label='住址:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="detail_data.address" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='学校:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="detail_data.school" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='班主任名称:' prop="title">
            <el-col :lg="15" :xl="12">
              <el-input v-model.trim="detail_data.masterName" clearable></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label='学习成绩:' prop="content">
            <el-col>
              <QuillEditor  :content="detail_data.score" @getContent="getScore2"   :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-form-item label='健康状况:' prop="content">
            <el-col>
              <QuillEditor :content="detail_data.healthy" @getContent="getHealty2"  :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>

          <el-form-item label='基本信息:' prop="content">
            <el-col>
              <QuillEditor :content="detail_data.baseMessage" @getContent="getBaseMessage2" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>

          <el-form-item label='面临的困难:' prop="content">
            <el-col>
              <QuillEditor :content="detail_data.faceDifficulty" @getContent="getFace2" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" style="float: right" @click="save">提交修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {createChild, delChildById, getChildById, getMyChildList, toApply, updateChild} from '../../service/api'
import Pay from '../../components/pay'
import Pagination from '../../components/pagination'
import axios from 'axios'
import QuillEditor from "../../components/quilleditor";

const regions = require('./regions.json');
export default {
  name: 'mychild',
  components: { Pay, Pagination ,QuillEditor},
  data () {
    return {
      childList: [],
      status: [{
        value: '-1',
        label: '全部'
      }, {
        value: '0',
        label: '审核中'
      }, {
        value: '1',
        label: '审核通过'
      }, {
        value: '2',
        label: '未通过'
      }],
      sex: [{
        value: '男',
        label: '男'
      },{
        value: '女',
        label: '女'
      }],
      search_param: {
        page: 1,
        size: 10,
        status: '-1',
        childName: ''
      },
      total: 0,
      activeName: 'first',
      show: true,
      add_data: {
        filePath: '',
        childName: '',
        childCode: '',
        childAge: '',
        childSex: '',
        address: '',
        city: [],
        school: '',
        score: '',
        healthy: '',
        baseMessage: '',
        masterName: '',
        faceDifficulty:'',
        status: 0,
        cityText: []
      },
      detail_data:{
        filePath: '',
        childName: '',
        childCode: '',
        childAge: '',
        childSex: '',
        address: '',
        city: [],
        school: '',
        score: '',
        healthy: '',
        baseMessage: '',
        masterName: '',
        faceDifficulty:'',
        status: 0,
        cityText: []
      },
      cities: [],
      urlPath: '',
      dialogLookVisible: false,
      dialogEditVisible: false
    }
  },
  created () {
    this.getMyChildList()
  },
  methods: {
    getMyChildList () {
      getMyChildList(this.search_param).then(re => {
        console.log(re)
        this.childList = re.list
        this.total = re.total
      })
    },
    pageSizeChange (val) {
      this.search_param.page = 1
      this.search_param.size = val.size
      this.getMyChildList()
    },
    pageIndexChange (val) {
      this.search_param.page = val.page
      this.getMyChildList()
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return  isLt2M
    },
    upload (param) {
      const formData = new FormData()
      formData.append('file', param.file)
      const url = 'http://localhost:8001/api/file/uploadPicture'
      axios.post(url, formData ).then(data => {
        console.log(data)
        this.add_data.filePath = data.data.path
      })
    },
    upload2 (param) {
      const formData = new FormData()
      formData.append('file', param.file)
      const url = 'http://localhost:8001/api/file/uploadPicture'
      axios.post(url, formData, {headers: {'Access-Control-Allow-Origin': '*'}}).then(data => {
        console.log(data)
        this.detail_data.filePath = data.data.path
      })
    },
    getCities() {
      this.cities = regions;
    },
    getScore (val) {
      // 赋值
      this.add_data.score = val
    },
    getHealty (val) {
      // 赋值
      this.add_data.healthy = val
    },
    getBaseMessage (val) {
      // 赋值
      this.add_data.baseMessage = val
    },
    getFace (val) {
      // 赋值
      this.add_data.faceDifficulty = val
    },
    getScore2 (val) {
      // 赋值
      this.detail_data.score = val
    },
    getHealty2 (val) {
      // 赋值
      this.detail_data.healthy = val
    },
    getBaseMessage2 (val) {
      // 赋值
      this.detail_data.baseMessage = val
    },
    getFace2 (val) {
      // 赋值
      this.detail_data.faceDifficulty = val
    },
    create(){
      this.add_data.cityText = this.$refs['city'].inputValue.split(" / ")
      createChild(this.add_data).then(re => {
        this.$message('创建成功，请等待审核');
        this.getMyChildList();
        this.activeName = 'first'
        this.add_data= {
          filePath: '',
          childName: '',
          childCode: '',
          childAge: '',
          childSex: '',
          address: '',
          city: [],
          school: '',
          score: '',
          healthy: '',
          baseMessage: '',
          masterName: '',
          faceDifficulty:'',
          status: 0,
          cityText: []
        }
      })
    },
    save(){
      console.log(this.$refs['city_change'].inputValue.split(" / "))
      this.detail_data.cityText = this.$refs['city_change'].inputValue.split(" / ")
      updateChild(this.detail_data).then(re => {
        this.$message('修改成功，请等待审核');
        this.getMyChildList();
        this.dialogEditVisible=false;
        this.activeName = 'first'
      })
    },
    del(id){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delChildById(id).then(re =>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getMyChildList();
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    personDetail(id){
      getChildById(id).then(re=>{
        this.detail_data=re;
        this.dialogLookVisible=true;
      })
    },
    personEdit(id){
      getChildById(id).then(re=>{
        this.detail_data=re;
        this.dialogEditVisible=true;
      })
    }
  },
  mounted() {
    this.getCities();
  }
}
</script>

<style scoped>
/*公益项目*/
.cardGyDiv p{
  color: #afafaf;
  font-size: 12px;
}
.cardTag{
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
}
/*card*/
.item {
  margin-bottom: 15px;
  list-style: none;
  cursor: pointer;
}
.item span:hover{
  color: #409eff;
}
/*图片*/
.image{
  width:100%;
  display: block;
}
/*标题*/
.title{
  margin-bottom: 20px;
  font-size: 1.17em;
  font-weight: bold;
}
a{
  color: #409eff;
}
/*历史纪录*/
dd{
  margin-left: 0px
}
dd span {
  background: url(/static/image/bg1.png) no-repeat;
  color: #579f23;
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
  height: 46px;
  line-height: 46px;
  margin-right: 10px;
  padding-right: 14px;
  text-align: right;
  width: 210px;
}
dt {
  font-family: "微软雅黑", "黑体";
  font-size: 16px;
  height: 36px;
  line-height: 36px;
}
.avatar-uploader  {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: center;
  width: 178px;
  margin-left: calc(50% - 178px);
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
