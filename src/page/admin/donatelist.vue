<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>菜单</span>
        <el-button style="float:right;margin-right: 15px" @click="addNewCategory" size="small">
          添加
        </el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable" :data="donateListData" style="width: 100%;" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.enabled === false" type="danger" @click="editNewCategory(scope.row.id,scope.row.name)">修改</el-button>
            <el-button size="mini" :disabled="scope.row.enabled === true" type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>

    <el-dialog class="adminRegister" :title="title" :visible.sync="dialogFormVisible">
      <el-form  ref="adminRegisterForm" >
        <el-form-item label="分类名称" :label-width="120" prop="name">
          <el-input v-model="name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdminRegisterForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import Pagination from '../../components/pagination'
import {addNewCategory, applyDel, delNewsCategory, donateList, updateNewsCategory} from '../../service/api'
import {timeFormat} from '../../utils/util'

export default {
  name: 'donatelist_layout',
  components: {Pagination},
  data () {
    return {
      donateListData: [],
      query: {
        page: '1',
        size: '10',
      },
      total: 0,
      add: true,
      dialogFormVisible: false,
      id: 0,
      name: '',
      title: '添加资讯分类'
    }
  },
  created () {
    this.donateListPage()
  },
  filters: {
    formatTime (time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      let date = new Date(time)
      return timeFormat(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    submitAdminRegisterForm(){
      if(this.add){
        addNewCategory({"name" : this.name}).then(re=>{
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.donateListPage()
          this.dialogFormVisible=false;
        })
      }else{
        updateNewsCategory({"name" : this.name,"id":this.id}).then(re=>{
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.donateListPage()
          this.dialogFormVisible=false;
        })
      }
    },
    addNewCategory(){
      this.add=true
      this.name=""
      this.id=0
      this.dialogFormVisible=true;
      this.title= '添加资讯分类'
    },
    editNewCategory(id,name){
      this.add=false
      this.name=name
      this.id=id
      this.dialogFormVisible=true;
      this.title= '修改资讯分类'
    },
    del(id){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delNewsCategory(id).then(re => {
          this.donateListPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    donateListPage () {
      donateList(this.query).then(re => {
        this.donateListData = re.list
        this.total = re.total
      })
    },
    pageSizeChange (val) {
      this.query.page = 1
      this.query.size = val.size
      this.structTime()
      this.donateListPage()
    },
    pageIndexChange (val) {
      this.query.page = val.page
      this.structTime()
      this.donateListPage()
    },
    handleSearchList () {
      this.structTime()
      this.donateListPage()
    },
    structTime () {
      if (this.datetimer) {
        this.query.begin = timeFormat(this.datetimer[0])
        this.query.end = timeFormat(this.datetimer[1])
      } else {
        this.query.begin = ''
        this.query.end = ''
      }
    },
    handleResetSearch () {
      this.query.type = ''
      this.query.search = ''
      this.datetimer = ''
      this.query.begin = ''
      this.query.end = ''
      this.query.page = 1
      this.query.size = 10
      this.donateListPage()
    }
  }
}
</script>

<style>

</style>
