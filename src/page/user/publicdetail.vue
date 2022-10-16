<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-image :src="apply.file" lazy style="height: 250px;width: 600px;" fit="fill" />
      </el-col>
      <el-col :span="11" :offset="1">
        <el-row v-if="!child">
          <el-col :span="8">预筹：<el-tag type="danger">{{ apply.goal }}</el-tag></el-col>
          <el-col :span="8">已筹：<el-tag type="success">{{ appeal.completed }}</el-tag></el-col>
          <el-col :span="8">剩余：<el-tag type="success">{{ can }}</el-tag></el-col>

        </el-row>
        <el-row v-if="!child" style="margin-top: 20px;">
          <el-col :span="8">已用：<el-tag type="success">{{ nowUsed }}</el-tag></el-col>
          <el-col :span="8">
            <span>捐款人次：{{ appeal.appealCount }}</span>
          </el-col>
          <el-col :span="8">状态：<el-tag type="success">{{ stateName }}</el-tag></el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="8" v-if="login&&canOper&&!child">
            <el-button round @click="toPay">我要捐款</el-button>
          </el-col>
          <el-col :span="8" v-if="login&&canOper&&child">
            <el-button round @click="toPay">我要参与</el-button>
          </el-col>
          <el-col :span="8" v-if="isSelf&&canOper">
            <el-button type="danger" round @click="toComponent(0)">活动完成</el-button>
          </el-col>
          <el-col :span="8" v-if="isSelf&&canOper">
            <el-button type="danger" round @click="toComponent(2)">活动下线</el-button>
          </el-col>
          <el-col :span="8" v-if="isSelf&&canUsed&!child">
            <el-button type="primary" round @click="toUsed">添加用途</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;">

      <el-tabs v-model="activeName" >
        <el-tab-pane v-if="!child" label="项目介绍" name="first">
          <el-col>
            <div style="font-size: 20px;font-weight: 600;">项目介绍</div>
            <div v-html="content"></div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="儿童信息" name="first" v-if="isChild">
          <el-descriptions class="margin-top"  :column="2" :size="size" border>
            <el-descriptions-item>
              <template slot="label">
                姓名
              </template>
              {{ child.childName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                性别
              </template>
              {{ child.childSex }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                年龄
              </template>
              {{ child.childAge }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                省份
              </template>
              {{ child.cityText[0] }}{{child.cityText[1]}}{{child.cityText[2]}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                住址
              </template>
              {{ child.address }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                学校
              </template>
              {{ child.school }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                班主任姓名
              </template>
              {{ child.masterName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                学习成绩
              </template>
              <p v-html="child.score"></p>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                健康状况
              </template>
              <p v-html="child.healthy"></p>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                基本信息
              </template>
              <p v-html="child.baseMessage"></p>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                面临的困难
              </template>
              <p v-html="child.faceDifficulty"></p>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane v-if="child" label="活动目的" name="second">
          <el-col>
            <div style="font-size: 20px;font-weight: 600;">活动目的</div>
            <div v-html="content"></div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane  v-if="!child"  label="捐款详情" name="third">
          <el-table :data="record" stripe style="width: 100%">
            <el-table-column prop="createdUserName" label="捐款人" sortable>
            </el-table-column>
            <el-table-column prop="money" label="捐款金额" sortable>
            </el-table-column>
            <el-table-column prop="receiverName" label="赠言" sortable>
            </el-table-column>
            <el-table-column prop="gmtCreated" label="捐款时间" sortable>
              <template slot-scope="scope">{{scope.row.gmtCreated | formatTime}}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane  v-if="child"  label="帮扶记录" name="third">
          <el-table :data="record" stripe style="width: 100%">
            <el-table-column prop="createdUserName" label="参与人" sortable>
            </el-table-column>
            <el-table-column prop="payOrder" label="帮扶内容" sortable>
            </el-table-column>
            <el-table-column prop="gmtCreated" label="帮扶时间" sortable>
              <template slot-scope="scope">{{scope.row.gmtCreated | formatTime}}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="捐款用途" v-if="!child"  name="forth">
          <el-table :data="used" stripe style="width: 100%">
            <el-table-column prop="usedContent" label="用途" sortable>
            </el-table-column>
            <el-table-column prop="usedMoney" label="消费金额" sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="使用时间" sortable>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-dialog v-if="!child" title="捐赠" width="50%" :visible.sync="dialogDonateVisible">
      <el-form size='size' label-position="right" label-width="120px"  :model="donate" ref="payForm">
        <el-form-item label='捐赠金额:' prop="donate.money" >
          <el-col :lg="13" :xl="12">
            <el-input v-model.trim="donate.money" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label='我的祝福:'>
          <el-col :lg="18" :xl="14">
            <el-input type="textarea" :rows="2" v-model="donate.receiverName">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="closePay" size="mini">取 消</el-button>
      <el-button type="primary" @click="donateMoney" size="mini">立即支付</el-button>
    </span>
    </el-dialog>

    <el-dialog title="帮扶" v-if="child" width="50%" :visible.sync="dialogDonateVisible">
      <el-form size='size' label-position="right" label-width="120px"  :model="donate" ref="payForm">
        <el-form-item label='帮扶内容:'>
          <el-col :lg="18" :xl="14">
            <el-input type="textarea" :rows="2" v-model="donate.payOrder">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="closePay" size="mini">取 消</el-button>
      <el-button type="primary" @click="donateMoney" size="mini">提交</el-button>
    </span>
    </el-dialog>

    <el-dialog title="使用" width="50%" :visible.sync="dialogUsedVisible">
      <el-form size='size' label-position="right" label-width="120px"  :model="donate" ref="payForm">
        <el-form-item label='使用金额:' prop="donate.money" >
          <el-col :lg="13" :xl="12">
            <el-input v-model.trim="used_detail.usedMoney" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label='用途:'>
          <el-col :lg="18" :xl="14">
            <el-input type="textarea" :rows="2" v-model="used_detail.usedContent">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="closeUsed" size="mini">取 消</el-button>
      <el-button type="primary" @click="UsedMoney" size="mini">立即添加</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  approveChild,
  componentApplyList,
  donateMoney,
  getApplyById,
  getPublicDetailById,
  usedMoney
} from '../../service/api'
  import Pay from '../../components/pay'
import {getCookie, timeFormat} from '../../utils/util'
  export default {
    name: "publicdetail",
    components: { Pay },
    data () {
      return {
        id : '',
        apply: {},
        appeal: {},
        record: [],
        child: {},
        isChild: false,
        isSelf: false,
        login: false,
        active: '',
        payshow: false,
        used: [],
        appealId: '',
        content: '',
        activeName: 'first',
        canOper: false,
        stateName: '',
        canUsed: false,
        nowUsed: 0,
        can: 0,
        dialogDonateVisible: false,
        dialogUsedVisible: false,
        donate:{
          money: 1
        },
        used_detail: {}
      }
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
    created () {
      this.id = this.$route.query.id
      this.detail()
    },
    methods : {
      detail () {
        getPublicDetailById(this.id).then(re => {
          this.visibleSync = true
          this.apply = re.apply
          this.appeal = re.appeal
          this.record = re.record
          this.child = re.child
          this.isChild = re.isChild
          this.used = re.used
          this.isSelf = re.isSelf
          this.login = re.login
          this.canOper = re.canOper
          this.stateName=re.stateName
          this.canUsed=re.canUsed
          this.nowUsed=re.nowUsed
          this.can=re.can
          this.content = re.apply.content
        })
      },
      toPay () {
        this.dialogDonateVisible=true
      },
      closePay(){
        this.dialogDonateVisible=false
        this.donate={}
      },
      // 关闭我要捐款弹框回调函数
      donateMoney(){
        this.donate.receiverId=this.id
        this.donate.recordState=0
        donateMoney(this.donate).then(re=>{
          this.$message.info('捐赠成功，感谢您的爱心')
          this.detail();
          this.dialogDonateVisible=false
          this.donate={}
        })
      },
      toUsed () {
        this.dialogUsedVisible=true
      },
      closeUsed(){
        this.dialogUsedVisible=false
        this.used_detail={}
      },
      // 关闭我要捐款弹框回调函数
      UsedMoney(){
        this.used_detail.applyId=this.id
        if(this.used_detail.usedMoney>this.can){
          this.$message.error('剩余金额不足')
          return ;
        }
        usedMoney(this.used_detail).then(re=>{
          this.$message.info('添加用途成功，请您按照用途使用捐赠的爱心')
          this.detail();
          this.dialogUsedVisible=false
          this.donate={}
        })
      },
      toComponent(status) {
        componentApplyList(this.id,status).then(re=>{
          this.$message('修改成功');
          this.detail()
        })
      },
    }
  }
</script>

<style scoped>

</style>
