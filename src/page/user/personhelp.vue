<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-cascader v-model="query.city" :options="cities" ref="city" clearable></el-cascader>
      </el-col>
      <el-col :span="8">
        <el-input v-model="query.childName" placeholder="请输入儿童姓名"></el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" round @click="getPersonList">搜索</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="5" v-for="child in personhelp" :key="child.id" style="margin: 20px">
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
                  <p>城市：{{ child.cityText }}</p>
                </el-col>
              </el-row>

              <el-row class="cardGyDiv">
                <el-col :span="16">
                  <div style="width: 50px">
                    <el-button round  @click="judgeDetail(child.applyId)" v-if="child.applyId>0">查看活动</el-button>
                    <el-button round @click="addapply(child.id)" v-if="child.applyId==0" >创建活动</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-badge>
      </el-col>
    </el-row>

    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
    <Pay :payshow="payshow" @callPayClose="callPayClose" :appealId="appealId"></Pay>
  </div>
</template>

<script>
import {getChild, getPersonList} from '../../service/api'
import Pay from '../../components/pay'
import Pagination from '../../components/pagination'
import { getCookie } from '../../utils/util'
import regions from "./regions.json";

export default {
  name: 'personhelp',
  components: { Pay, Pagination },
  data () {
    return {
      personListData: [],
      query: {
        page: '1',
        size: '10',
        status: 1,
        title: '',
        city: []
      },
      payshow: false,
      appealId: '',
      tooltip: '点击查看求助详情',
      total: 0,
      visibleSync: false,
      personhelp: [],
      cities: [],
    }
  },
  mounted() {
    this.getCities();
  },
  created () {
    this.getPersonList()
  },
  methods: {
    getPersonList () {
      getChild(this.query).then(re => {
        this.personhelp = re.list
        this.total = re.total
      })
    },
    callPayClose (val) {
      this.payshow = val
    },
    pageSizeChange (val) {
      this.query.page = 1
      this.query.size = val.size
      this.getPersonList()
    },
    pageIndexChange (val) {
      this.query.page = val.page
      this.getPersonList()
    },
    detail (val) {
      this.$router.push({path: '/applydetail', query: {id: val}})
    },
    getCities() {
      this.cities = regions;
    },
  judgeDetail(val){
    this.$router.push({path: '/publicdetail', query: {id: val}})
  },
  addapply(id) {
    let flag = getCookie('token')
    if (flag) {
      window.open('http://127.0.0.1:8001/#/myapply?edit=1&child=' + id);
    } else {
      this.$router.push({path: '/login'})
    }
  }
  }
}
</script>

<style scoped>
  .image {
    width: 100px;
    height: 100px;
  }
  .image-div {
    margin-bottom: 15px;
    cursor: pointer;
  }
  .title {
    font-size: 24px;
    font-weight: 600;
    cursor: pointer;
  }
  .el-badge {
    display: block;
  }
  .div {
    cursor: pointer;
    float: right;
    width: 100px;
  }
</style>
