<template>
  <div>

    <el-card class="filter-container" shadow="never">
      <div>
        <el-button style="float:right;margin-right: 15px" @click="add_space_show" size="small">
          添加动态
        </el-button>
      </div>
    </el-card>

  <el-card class="box-card" v-for="space in space_list" :key="space.id" style="margin-top: 20px">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="12">{{ space.addUserName }} 发表于  {{ space.createDate}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="16"><b>{{ space.title }}</b></el-col>
        <el-col :span="8"><el-button style="float: right; padding: 3px 0" type="text" @click="getReply(space.id,space.state)">{{ space.stateName }}</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-html="space.content"></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-edit" circle @click="reply_space_show(space.id,0)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle v-if="space.canEdit" @click="delSpace(space.id)"></el-button>
        </el-col>
      </el-row>
    </div>
    <div v-for="reply in space.reply " :key="reply.id" class="text item" style="margin-top: 10px">
      <el-row>
        <el-col :span="24">{{ reply.addUserName }}  {{reply.replyUserName}}  </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-html="reply.content"></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-edit" circle  @click="reply_space_show(space.id,reply.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle v-if="reply.canEdit" @click="delSpaceReply(reply.id)"></el-button>
        </el-col>
      </el-row>
    </div>
  </el-card>

    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>


    <el-dialog class="adminRegister" title="添加动态" :visible.sync="add_show">
      <el-form  ref="adminRegisterForm" >
        <el-form-item label="标题" :label-width="120" prop="title">
          <el-input v-model="add.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label='空间内容:' prop="content">
          <el-col>
            <QuillEditor @getContent="getContent" :urlPath="urlPath"></QuillEditor>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-upload class="upload-demo" ref="add-upload" :action="uploadUrl" :on-success="uploadSuccess"
                          name="file" list-type="picture-card">
                <el-button size="small" type="primary">插入图片</el-button>
                <div slot="tip" class="el-upload__tip">插入图片到求助内容中，仅支持jpg、jpeg、png格式图片</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_show = false">取 消</el-button>
        <el-button type="primary" @click="add_space">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="adminRegister" title="回复" :visible.sync="reply_show">
      <el-form  ref="adminRegisterForm" >
        <el-form-item label='空间内容:' prop="content">
          <el-col>
            <QuillEditor @getContent="getContent2" :urlPath="urlPath2"></QuillEditor>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-upload class="upload-demo" ref="reply-upload" :action="uploadUrl" :on-success="uploadSuccess2"
                         name="file" list-type="picture-card">
                <el-button size="small" type="primary">插入图片</el-button>
                <div slot="tip" class="el-upload__tip">插入图片到求助内容中，仅支持jpg、jpeg、png格式图片</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_show = false">取 消</el-button>
        <el-button type="primary" @click="add_reply">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {addSpace, addSpaceReply, delSpace, delSpaceReply, getSpace, getSpaceReply} from "../../service/api";
import Pagination from "../../components/pagination";
import QuillEditor from "../../components/quilleditor";

export default {
  name: "space",
  components: {Pagination,QuillEditor},
  data(){
    return{
      query:{
        page:1,
        size:10
      },
      default_query:{
        page:1,
        size:3,
        spaceId: 0
      },
      add:{

      },
      reply_content:{

      },
      space_list:[],
      total: 0,
      add_show:false,
      uploadUrl: 'http://localhost:8001/api/file/uploadPicture',
      urlPath:'',
      reply_show:false,
      urlPath2:'',

    }
  },
created() {
  this.getSpace();
},
  methods: {
    getSpace(){
      getSpace(this.query).then(re=>{
        this.space_list=re.list
        this.total=re.total
        for(var i=0;i<this.space_list.length;i++){
          this.getReply(this.space_list[i].id,0);
        }

      })
    },
    getReply(id,type){
      if(type==0){
        getSpaceReply({"spaceId":id,"page":1,"size":3}).then(re=>{
          for(var i=0;i<this.space_list.length;i++){
            if(this.space_list[i].id==id){
              this.space_list[i].reply=re.list
              this.space_list[i].stateName='展开全部回复'
              this.space_list[i].state=1;
              console.log(this.space_list[i].id)
              console.log(re.list)
            }
            this.space_list.push({})
            this.space_list.pop()
          }

        })
      }else{
        getSpaceReply({"spaceId":id}).then(re=>{
          for(var i=0;i<this.space_list.length;i++){
            if(this.space_list[i].id==id){
              this.space_list[i].reply=re.list
              this.space_list[i].stateName='收起回复'
              this.space_list[i].state=0;
            }
            this.space_list.push({})
            this.space_list.pop()
          }
        })
      }
    },
    delSpace(id){
      delSpace(id).then(re=>{
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getSpace();
      })
    },
    delSpaceReply(id){
      delSpaceReply(id).then(re=>{
        this.$message({
          type: 'info',
          message: '删除成功'
        })
        this.getSpace(id,0)
      })
    },
    pageSizeChange(val) {
      this.query.page = 1
      this.query.size = val.size
      this.getSpace()
    },
    pageIndexChange(val) {
      this.query.page = val.page
      this.getSpace()
    },
    add_space(){
      addSpace(this.add).then(re=>{
        this.$message({
          type: 'info',
          message: '添加成功'
        })
        this.getSpace();
        this.add_show=false
        this.$refs['add-upload'].clearFiles();
      })
    },
    add_space_show(){
      this.add_show=true
      this.add={}
    },
    reply_space_show(spid,reid){
      this.reply_show=true
      this.reply_content={
        "spaceId":spid,
        "replayId":reid
      }
    },
    uploadSuccess (response, file, fileList) {
      this.urlPath = response.path
    },
    getContent (val) {
      // 赋值
      this.add.content = val
    },
    uploadSuccess2 (response, file, fileList) {
      this.urlPath2 = response.path
    },
    getContent2 (val) {
      // 赋值
      this.reply_content.content = val
    },
    add_reply(){
      addSpaceReply(this.reply_content).then(re=>{
        this.$message({
          type: 'info',
          message: '添加成功'
        })
        this.getReply(this.reply_content.spaceId,0);
        this.reply_show=false
        this.$refs['reply-upload'].clearFiles();
      })
    },




  }
}
</script>

<style scoped>
  p img{
    width: 100px;
  }
</style>
