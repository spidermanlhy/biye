<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="donateCountPage" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch" size="small">
          重置
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="open_add" size="small">
          添加新闻
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <el-form-item label="类型：">
            <el-select v-model="query.type" placeholder="请选择" clearable class="input-width">
              <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="query.title" placeholder="条件"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="donateCountData"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="新闻标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">{{scope.row.createDate}}</template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template slot-scope="scope">{{scope.row.addUserName}}</template>
        </el-table-column>

        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.enabled === false" type="danger" @click="open(scope.row.title,scope.row.content)">查看</el-button>
            <el-button size="mini" :disabled="scope.row.enabled === true" type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>

    <el-dialog class="adminRegister" title="添加新闻" :visible.sync="dialogFormVisible">
      <el-form  ref="adminRegisterForm" >
        <el-form-item label="新闻类型" :label-width="120" prop="title">
          <el-select v-model="type" placeholder="请选择" clearable class="input-width">
            <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="新闻标题" :label-width="120" prop="title">
          <el-input v-model="title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label='新闻内容:' prop="content">
          <el-col>
            <QuillEditor @getContent="getContent" :urlPath="urlPath"></QuillEditor>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-upload class="upload-demo" ref="my-upload" :action="uploadUrl" :on-success="uploadSuccess"
                         :before-upload="beforeUploadImage" name="file" list-type="picture-card">
                <el-button size="small" type="primary">插入图片</el-button>
                <div slot="tip" class="el-upload__tip">插入图片到求助内容中，仅支持jpg、jpeg、png格式图片</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="adminRegister" :title="open_title" :visible.sync="show">
      <div v-html="open_content"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  import Pagination from '../../components/pagination'
  import {addNews, delNews, delNewsCategory, donateCount, donateList} from '../../service/api'
  import {timeFormat} from '../../utils/util';
  import QuillEditor from "../../components/quilleditor";

  export default {
    name: 'donatecount_layout',
    components: {Pagination,QuillEditor},
    data() {
      return {
        donateCountData: [],
        query: {
          page: '1',
          size: '10',
          type: '',
          title:''
        },
        datetimer: '',
        total: 0,
        projectOptions:[],
        title: '',
        content: '',
        uploadUrl: 'http://localhost:8001/api/file/uploadPicture',
        urlPath: '',
        dialogFormVisible:false,
        type:0,
        show:false,
        open_title:'',
        open_content:'',
      }
    },
    created() {
      this.donateCountPage();
      this.getCategory();
    },
    filters: {
      formatTime(time) {
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return timeFormat(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      open(title,content){
        this.open_title=title
        this.open_content=content,
          this.show=true
      },
      del(id){
        this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delNews(id).then(re => {
            this.donateCountPage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getCategory(){
        donateList({}).then(re=>{
          this.projectOptions=re.list;
          this.projectOptions.push({"id":0,"name":"全部"})
        })
      },
      // 上传成功请求的方法
      uploadSuccess (response, file, fileList) {
        this.urlPath = response.path
      },
      getContent (val) {
        // 赋值
        this.content = val
      },
      donateCountPage() {
        donateCount(this.query).then(re => {
          this.donateCountData = re.list
          this.total = re.total
        })
      },
      pageSizeChange(val) {
        this.query.page = 1
        this.query.size = val.size
        this.structTime()
        this.donateCountPage()
      },
      pageIndexChange(val) {
        this.query.page = val.page
        this.structTime()
        this.donateCountPage()
      },
      handleSearchList () {
        this.structTime()
        this.donateCountPage()
      },
      open_add(){
        this.title=""
        this.content=""
        this.urlPath=""
        this.type=0
        //this.$refs['my-upload'].clearFiles();
        this.dialogFormVisible=true
      },
      add(){
        addNews({"title":this.title,"type":this.type,"content":this.content}).then(re=>{
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogFormVisible=false;
          this.$refs['my-upload'].clearFiles();
          this.donateCountPage();
        })
      },
      handleResetSearch () {
        this.query.type = ''
        this.query.search = ''
        this.datetimer = ''
        this.query.begin = ''
        this.query.end = ''
        this.query.page = 1
        this.query.size = 10
        this.donateCountPage()
      }
    }
  }
</script>
<style>

</style>
