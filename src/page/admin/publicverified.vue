<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="getPublicUnVerifiedPage" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <el-form-item label="项目名称：">
            <el-input v-model="query.title" class="input-width" placeholder="公益项目名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <div class="table-container">
      <el-table ref="newProductTable" :data="publicUnVerifiedData" style="width: 100%;" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="已筹金额" align="center">
          <template slot-scope="scope">{{scope.row.completed}}</template>
        </el-table-column>
        <el-table-column label="预筹金额" align="center">
          <template slot-scope="scope">{{scope.row.goal}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.statusName}}</template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">{{ scope.row.gmtModified | formatTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="toComponent(scope.row.id,0)" v-if="scope.row.completedStatus==1">完成
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="toComponent(scope.row.id,2)" v-if="scope.row.completedStatus==1">下线
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="personDetail( scope.row.id)">查看详情
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleRemove(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="公益项目详细信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <el-form-item label="已筹金额" :label-width="formLabelWidth" style="text-align:left">
            <el-input v-model="form.completed" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-container>
            <el-form-item label="预筹金额" :label-width="formLabelWidth">
              <el-input v-model="form.goal" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

import Pagination from '../../components/pagination'
import {
  getPublicUnVerified,
  applyUpdate,
  approve,
  applyDel,
  getAppealById,
  getApplyList,
  approveApplyList, componentApplyList, delApply
} from '../../service/api'
import {timeFormat} from '../../utils/util';

export default {
  name: 'publicUnverified_layout',
  components: {Pagination},
  data() {
    return {
      publicUnVerifiedData: [],
      query: {
        page: '1',
        size: '10',
        search: '',
        begin: '',
        end: '',
        applyState: 1,
        applyType:0
      },
      form: {},
      dialogFormVisible: false,
      datetimer: '',
      total: 0,
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClickn(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getPublicUnVerifiedPage()
  },
  filters: {
    formatTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return timeFormat(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    getPublicUnVerifiedPage() {
      getApplyList(this.query).then(re => {
        this.publicUnVerifiedData = re.list
        this.total = re.total
      })
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      getAppealById(row.id).then(re => {
        this.form = re;
        this.form.appealState = String(re.appealState);
      })
    },
    pageSizeChange(val) {
      this.query.page = 1
      this.query.size = val.size
      this.structTime()
      this.getPublicUnVerifiedPage()
    },
    pageIndexChange(val) {
      this.query.page = val.page
      this.structTime()
      this.getPublicUnVerifiedPage()
    },
    handleSearchList() {
      this.structTime()
      this.getPublicUnVerifiedPage()
    },
    structTime() {
      if (this.datetimer) {
        this.query.begin = timeFormat(this.datetimer[0])
        this.query.end = timeFormat(this.datetimer[1])
      } else {
        this.query.begin = ''
        this.query.end = ''
      }
    },
    handleResetSearch() {
      this.query.search = ''
      this.datetimer = ''
      this.query.begin = ''
      this.query.end = ''
      this.query.page = 1
      this.query.size = 10
      this.getPublicUnVerifiedPage()
    },
    submitForm() {
      applyUpdate(this.form).then(re =>{
        this.dialogFormVisible = false;
        this.getPublicUnVerifiedPage()
      })
    },
    /*approve(row) {
      approve(row.id).then(re => {
        this.getPublicUnVerifiedPage()
      })
    },*/
    toApprove(id,status) {
      approveApplyList(id,status).then(re=>{
        this.$message('审核成功');
        this.getPublicUnVerifiedPage()
      })
    },
    handleRemove(id){
      this.$confirm('此操作将永久删除该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApply(id).then(re => {
          this.getPublicUnVerifiedPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    personDetail (val) {
      window.open('/#/publicdetail?id='+val)
    },
    toComponent(id,status) {
      componentApplyList(id,status).then(re=>{
        this.$message('修改成功');
        this.getPublicUnVerifiedPage()
      })
    },
  }
}
</script>

<style>

</style>
