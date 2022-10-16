<template>
  <div>
    <el-tabs v-model="activeName" >
      <el-tab-pane label="公益项目"  name="first">
        <!--              搜索栏                 -->
       <el-row :gutter="20">
          <el-col :span="8">
            <el-select v-model="search_param.applyState" placeholder="请选择状态">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="search_param.title" placeholder="请输入活动标题"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" round @click="myApplyList">搜索</el-button>
          </el-col>
      </el-row>
      <!--              我的活动列表             -->
        <el-row>
          <el-col :span="5" v-for="apply in public_apply" :key="apply.id" style="margin: 20px;height: 450px">
            <el-badge :value="apply.statusName" class="item">
              <el-card>
                <div  @click="personDetail(apply.id)">
                  <el-image :src="apply.file" lazy style="height: 179px; width: 200px;" fit="fill"/>
                </div>

                <div style="padding: 14px;">
                  <div @click="personDetail(apply.id)">
                    <span> {{ apply.title }}</span>
                  </div>

                  <el-row class="cardGyDiv">
                    <el-col :span="25">
                      <p>目标：{{ apply.goal }}元 </p>
                      <p>已完成：{{ apply.completed }}元</p>
                    </el-col>
                  </el-row>

                  <el-row class="cardGyDiv">
                    <el-col :span="16">
                      <el-button type="primary" icon="el-icon-edit" circle @click="edit_get(apply.id)"></el-button>
                      <el-button type="danger" icon="el-icon-delete" circle  @click="del(apply.id)"></el-button>
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
      <el-tab-pane label="同城活动"  name="second">
        <!--              搜索栏                 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="search_param2.applyState" placeholder="请选择状态">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="search_param2.title" placeholder="请输入活动标题"></el-input>
          </el-col>
          <el-col :span="6">
            <el-cascader v-model="search_param2.city" :options="cities" ref="city"></el-cascader>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" round @click="myApplyList2">搜索</el-button>
          </el-col>
        </el-row>
        <!--              我的活动列表             -->
        <el-row>
          <el-col :span="5" v-for="apply in people_apply" :key="apply.id" style="margin: 20px;height: 450px">
            <el-badge :value="apply.statusName" class="item">
              <el-card>
                <div  @click="personDetail(apply.id)">
                  <el-image :src="apply.file"  style="height: 179px; width: 200px;" fit="fill"/>
                </div>

                <div style="padding: 14px;">
                  <div @click="personDetail(apply.id)">
                    <span> {{ apply.title }}</span>
                  </div>


                  <el-row class="cardGyDiv">
                    <el-col :span="16">
                      <el-button type="primary" icon="el-icon-edit" circle @click="edit_get(apply.id)"></el-button>
                      <el-button type="danger" icon="el-icon-delete" circle  @click="del(apply.id)"></el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-badge>
          </el-col>

        </el-row>
        <Pagination :pageSize="this.search_param2.size" :pageIndex="this.search_param2.page" :total="total2"
                    @pageSizeChange="pageSizeChange2" @pageIndexChange="pageIndexChange2"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="创建活动"  name="third">
        <el-form label-position="right" label-width="120px" :model="add_apply" ref="forhelpRef" class="formClass">
          <el-form-item label='活动标题:' prop="title">
            <el-col :lg="13" :xl="12">
              <el-input v-model.trim="add_apply.title" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='预筹金额:' prop="goal" v-if="radio==0">
            <el-col :lg="13" :xl="12">
              <el-input v-model.trim="add_apply.goal" clearable placeholder="请输入正确的金额(支持两位小数)">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='求助内容:' prop="content" v-if="radio==0">
            <el-col>
              <QuillEditor @getContent="getContent" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-form-item label='活动目的' prop="content" v-if="radio==1">
            <el-col>
              <QuillEditor @getContent="getContent" :urlPath="urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadSuccess"
                           :before-upload="beforeUploadImage" name="file" ref="img1" list-type="picture-card">
                  <el-button size="small" type="primary">插入图片</el-button>
                  <div slot="tip" class="el-upload__tip">插入图片到求助内容中，仅支持jpg、jpeg、png格式图片</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label='求助封面:' prop="file">
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadFileSuccess"
                       :before-upload="beforeUploadImage" name="file" :on-remove="removeFileImage"
                       list-type="picture" :limit="1" ref="img2" :on-exceed="handleExceed">
              <el-button size="small" type="primary">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">只允许上传一张封面图</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" style="float: right" @click="tohelp">创建活动</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改活动" name="forth" disabled="true">
        <el-form label-position="right" label-width="120px" :model="edit_apply" ref="forhelpRef" class="formClass">
          <el-form-item label='活动标题:' prop="title">
            <el-col :lg="13" :xl="12">
              <el-input v-model.trim="edit_apply.title" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='预筹金额:' prop="goal" v-if="edit_radio==0">
            <el-col :lg="13" :xl="12">
              <el-input v-model.trim="edit_apply.goal" clearable placeholder="请输入正确的金额(支持两位小数)">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label='求助内容:' prop="content" v-if="edit_radio==0">
            <el-col>
              <QuillEditor :content="edit_content" @getContent="getContent2" :urlPath="edit_urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-form-item label='活动目的:' prop="content" v-if="edit_radio==1">
            <el-col>
              <QuillEditor :content="edit_content" @getContent="getContent2" :urlPath="edit_urlPath"></QuillEditor>
            </el-col>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadSuccess2"
                           :before-upload="beforeUploadImage" name="file" ref="img3" list-type="picture-card">
                  <el-button size="small" type="primary">插入图片</el-button>
                  <div slot="tip" class="el-upload__tip">插入图片到求助内容中，仅支持jpg、jpeg、png格式图片</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label='求助封面:' prop="file">
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadFileSuccess2"
                       :before-upload="beforeUploadImage" name="file" :on-remove="removeFileImage2"
                       list-type="picture" :limit="1" ref="img4" :on-exceed="handleExceed">
              <el-button size="small" type="primary">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">只允许上传一张封面图</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" style="float: right" @click="edit_save">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!--修改活动-->

  </div>
</template>

<script>
import {delApply, delChildById, editApply, getApplyById, getMyChildList, myApplyList, toApply} from "../../service/api";
import regions from "./regions.json";
import Pay from '../../components/pay'
import Pagination from '../../components/pagination'
import QuillEditor from "../../components/quilleditor";

export default {
name: "myapply",
  components: { Pay, Pagination ,QuillEditor},
  data(){
    return{
      activeName: 'first',
      search_param: {
        page: 1,
        size: 10,
        applyState: -1,
        applyType: 0,
        title: '',
        city: []
      },
      search_param2: {
        page: 1,
        size: 10,
        applyState: -1,
        applyType: 1,
        title: '',
        city: []
      },
      status: [{
        value: -1,
        label: '全部'
      }, {
        value: 0,
        label: '审核中'
      }, {
        value: 1,
        label: '审核通过'
      }, {
        value: 2,
        label: '未通过'
      }, {
        value: 3,
        label: '已完成'
      }, {
        value: 4,
        label: '已下线'
      }],
      public_apply: [],
      people_apply: [],
      total: 0,
      total2: 0,
      edit: false,
      cities: [],
      add_apply: {},
      edit_apply: {},
      uploadUrl: 'http://localhost:8001/api/file/uploadPicture',
      // 传到编辑器组件的参数set到编辑器中
      urlPath: '',
      // 求助类型radio 默认选中公益项目
      radio: 0,
      // 封面上传后返回的路径
      filePath: '',
      // 求助内容v-model
      content: '',
      child: 0,

      // 传到编辑器组件的参数set到编辑器中
      edit_urlPath: '',
      // 求助类型radio 默认选中公益项目
      edit_radio: 0,
      // 封面上传后返回的路径
      edit_filePath: '',
      // 求助内容v-model
      edit_content: '',
      edit_child: 0,
      edit_fileList: []
    }
  },
  created () {
    this.myApplyList()
    this.myApplyList2()
    var child_id=this.$route.query.child
    var edit_model=this.$route.query.edit
    var id=this.$route.query.id

    if(edit_model!=null&&edit_model==1){
      if(child_id!=null){
        this.child=child_id;
        this.radio=1
      }
      this.activeName="third"
    }else if(edit_model!=null&&edit_model==2){
      this.edit_get(id)
    }
  },
  methods: {
    myApplyList () {
      myApplyList(this.search_param).then(re => {
        console.log(re)
        this.public_apply = re.list
        this.total = re.total
      })
    },
    myApplyList2 () {
      myApplyList(this.search_param2).then(re => {
        console.log(re)
        this.people_apply = re.list
        this.total2 = re.total
      })
    },
    pageSizeChange (val) {
      this.search_param.page = 1
      this.search_param.size = val.size
      this.myApplyList()
    },
    pageIndexChange (val) {
      this.search_param.page = val.page
      this.myApplyList()
    },
    pageSizeChange2 (val) {
      this.search_param2.page = 1
      this.search_param2.size = val.size
      this.myApplyList2()
    },
    pageIndexChange2 (val) {
      this.search_param2.page = val.page
      this.myApplyList2()
    },
    getCities() {
      this.cities = regions;
    },
    // 上传成功请求的方法
    uploadSuccess (response, file, fileList) {
      this.urlPath = response.path
    },
    // 上传封面成功请求的方法
    uploadFileSuccess (response, file, fileList) {
      this.filePath = response.path
    },
    // 上传成功请求的方法
    uploadSuccess2 (response, file, fileList) {
      this.edit_urlPath = response.path
    },
    // 上传封面成功请求的方法
    uploadFileSuccess2 (response, file, fileList) {
      this.edit_filePath = response.path
    },
    // 上传文件之前请求的方法
    beforeUploadImage (file) {
      let name = file.name.split('.')[1].toUpperCase()
      if (name !== 'JPG' && name !== 'JPEG' && name !== 'PNG') {
        this.$message.warning('图片格式不符合要求')
        return false
      }
    },
    // 上传文件个数限制
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制只能选择 1 个文件，请删除原图片后再次选择上传`)
    },
    // 删除封面图片访问的方法
    removeFileImage (file, fileList) {
      this.filePath = ''
    },
    // 删除封面图片访问的方法
    removeFileImage2 (file, fileList) {
      this.filePath = ''
    },
    // 编辑器子组件进入的方法(val时是编辑器内html代码)
    getContent (val) {
      // 赋值
      this.add_apply.content = val
      this.content = val
    },
    // 编辑器子组件进入的方法(val时是编辑器内html代码)
    getContent2 (val) {
      // 赋值
      this.edit_apply.content = val
      this.edit_content = val
    },
    tohelp () {
      this.add_apply.applyType = this.radio
      this.add_apply.file = this.filePath
      this.add_apply.childId = this.child
      toApply(this.add_apply).then(re => {
        this.$refs['img1'].clearFiles();
        this.$refs['img2'].clearFiles();
        if(this.radio == 0){
          this.activeName="first"
          this.myApplyList()
        }else{
          this.activeName="second"
          this.myApplyList2()
        }
        this.radio=0;
        this.filePath=''
        this.child=0
        this.add_apply={}
      })
    },
    edit_get (id) {
      getApplyById(id).then(re => {
        this.edit_apply = re.data;
        this.edit = true
        this.activeName = 'forth'
        this.edit_content=re.data.content
        this.edit_filePath=re.data.file
        this.edit_child=re.data.childId
        this.edit_radio=re.data.applyType
      })
    },
    edit_save () {
      this.edit_apply.applyType = this.edit_radio
      this.edit_apply.file = this.edit_filePath
      this.edit_apply.childId = this.edit_child
      editApply(this.edit_apply).then(re => {
        if(this.radio == 0){
          this.activeName="first"
          this.myApplyList()
        }else{
          this.activeName="second"
          this.myApplyList2()
        }
        this.edit_radio=0;
        this.edit_filePath=''
        this.edit_child=0
        this.edit_apply={}
        this.$refs['img3'].clearFiles();
        this.$refs['img4'].clearFiles();
        this.edit=false
      })
    },
    close_edit(){
      this.edit=false
    },
    del(id){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApply(id).then(re =>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.myApplyList();
          this.myApplyList2()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
  mounted() {
    this.getCities();
  }
}
</script>

<style scoped>

</style>
