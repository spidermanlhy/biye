<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="getPersonUnVerifiedPage" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <el-form-item label="城市:">
            <el-cascader v-model="query.city" :options="cities" ref="city"></el-cascader>
          </el-form-item>
          <el-form-item label="儿童姓名：">
            <el-input v-model="query.childName" class="input-width" placeholder="公益项目名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <div class="table-container">
      <el-table ref="newProductTable" :data="personUnVerifiedData" style="width: 100%;" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="儿童姓名" align="center">
          <template slot-scope="scope">{{scope.row.childName}}</template>
        </el-table-column>
        <el-table-column label="儿童编号" align="center">
          <template slot-scope="scope">{{scope.row.childCode}}</template>
        </el-table-column>
        <el-table-column label="城市" align="center">
          <template slot-scope="scope">{{scope.row.cityText}}</template>
        </el-table-column>
        <el-table-column label="学校" align="center">
          <template slot-scope="scope">{{ scope.row.school}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="personDetail(scope.row.id)">查看资料
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="toApprove(scope.row.id, 1)">通过
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="toApprove(scope.row.id, 2)">驳回
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="del(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

  import Pagination from '../../components/pagination'
  import {
    getPersonUnVerified,
    applyUpdate,
    approve,
    applyDel,
    getAppealById,
    getChildList,
    getChildById, approveChild, delChildById
  } from '../../service/api'
  import {timeFormat} from '../../utils/util';

  const regions = require('./regions.json');
  export default {
    name: 'personverified_layout',
    components: {Pagination},
    data() {
      return {
        personUnVerifiedData: [],
        query: {
          page: '1',
          size: '10',
          childName: '',
          city: [],
          status: 0
        },
        dialogFormVisible: false,
        datetimer: '',
        form: {},
        total: 0,
        dialogLookVisible: false,
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
        }
      }
    },
    created() {
      this.getPersonUnVerifiedPage()
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
      getPersonUnVerifiedPage() {
        getChildList(this.query).then(re => {
          this.personUnVerifiedData = re.list
          this.total = re.total
        })
      },
      getCities() {
        this.cities = regions;
      },
      pageSizeChange(val) {
        this.query.page = 1
        this.query.size = val.size
        this.structTime()
        this.getPersonUnVerifiedPage()
      },
      pageIndexChange(val) {
        this.query.page = val.page
        this.structTime()
        this.getPersonUnVerifiedPage()
      },
      handleResetSearch() {
        this.query.childName = ''
        this.query.city = []
        this.query.status = 0
        this.query.page = 1
        this.query.size = 10
        this.getPersonUnVerifiedPage()
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
            this.getPersonUnVerifiedPage();
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
      toApprove(id,status) {
        approveChild(id,status).then(re=>{
          this.$message('审核成功');
          this.getPersonUnVerifiedPage()
        })
      },

    },
  mounted() {
    this.getCities();
  }
  }
</script>

<style>

</style>
