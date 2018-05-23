<template>
    <div class="level">
        <el-table v-loading="load" :data="level" style="width: 100%" class="table">
            <el-table-column prop="businessLevelName" label="级别" :formatter="levelAndName"></el-table-column>
            <el-table-column prop="businessLevelEmpnum"  label="人数"></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button @click="changeLevel(scope.row)" type="text" size="small"><img src="../assets/bianji.png" alt=""></el-button>
                    <el-button @click="delLevel(scope.row)" type="text" size="small"><img src="../assets/shanchu.png" alt=""></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex">
            <el-col class="add"><el-button type="text" @click="addLevel" >添加新级别</el-button></el-col>  
        </el-row> 
    <div class="block pagimg">
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="pageCurrentChange"
      :current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
    <!-- 添加弹出框 -->
    <el-dialog title="添加新级别" :visible.sync="appendLevel">
        <el-form :model="form">
            <el-form-item label="*级别" style="color:#f78989;" :label-width="formLabelWidth">
            <el-input v-model="form.level" type="number" disabled="disabled" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="*级别名称" style="color:#f78989;" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="appendLevel = false">取 消</el-button>
            <el-button type="primary" @click="addLevelConfirm">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>
<script>
import store from '../vuex/store'
export default {
  data(){
      return {
        level:[],//部门
        companyId:null,
        url:null,
        pageNum:1,
        pageSize:10,
        total:null,
        nowPage:1,
        load:true,
        appendLevel:false,
        form:{
            level:'',
            name:'',
        },
        formLabelWidth:'200px',
      }
  },
  props:['ind'],
  created(){
    this.companyId=store.state.userInfo.companyId;
    this.url=store.state.api;
  },
  mounted(){
  },
   watch:{
      ind(val,oldVal){
        if(val==22){
            this.nowPage=1
            this.getLevel(this.pageNum,this.pageSize)
        }
      }
  },
  methods:{
      getLevel(pageNum,pageSize){
         var url=store.state;
      var body={
          companyId:this.companyId,
          pageNum:pageNum,
          pageSize:pageSize
      }
       this.$http.post(this.url.localhost+this.url.getLevel, body,
        // 需要配置一下
        {emulateJSON: true}).then( (res) => {
        if(res.body!=""&&res.body.code==200){
            this.loadTable=false;
            var data=res.body.data;
            this.level=data.list;
            this.total=data.total;
            this.load=false;
        }else{
            this.$message({
                 type: 'error',
                 message: res.body.message
            })
        }
    }, (err) => {
    })
      },
      addLevelConfirm(e){//添加新级别
        if(this.form.level==''){
            this.$message({
                message:'亲，级别不能为空',
                type:'warning'
            })
        }else if(this.form.name==''){
             this.$message({
                message:'亲，级别名称不能为空',
                type:'warning'
            })
        }else{
            var body={
                levelNum:this.form.level,
                levelName:this.form.name,
                companyId:this.companyId
            }
            this.$http.post(this.url.localhost+this.url.addLevel, body,{emulateJSON: true}).then((res)=>{
               if(res.body.code==200&&res.body.message=="SUCCESS"){
                    this.$message({
                        message: '添加成功！',
                        type: 'success',
                        
                    });
                    this.appendLevel=false;
                    this.getLevel(this.pageNum,this.pageSize);
                    this.form.level='';
                     this.form.name='';
               }else{
                    this.$message({
                        type: 'error',
                        message: res.body.message
                    });
                    this.form.level='';
                     this.form.name='';
               }
        //    })
        })
      }
      },
      changeLevel(e){//修改名称
        var that=this;
        this.$prompt('请输入级别名称', '修改级别名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator:value=>{
              console.log("输入框小燕："+value)
              if(value==null){
                  return false;
              }
          },
          inputErrorMessage:'级别名称不能为空！'
        }).then(({ value }) => {
            if(value!=null){
            var body={
                levelId:e.businessLevelId,
                levelName:value
            }
              this.$http.post(this.url.localhost+this.url.updateLevel, body,{emulateJSON: true}).then((res)=>{
               if(res.body.code==200&&res.body.message=="修改名称成功"){
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                    });
                     this.getLevel(this.pageNum,this.pageSize);
                     this.appendLevel=false;
                     this.form.level='';
                     this.form.name='';
               }else{
                    this.$message({
                        type: 'error',
                        message: res.body.message
                    });
                    this.changeLevel(e)
               }
           })
           }else{
               this.$message({
                   type:'warning',
                   message:'级别名称不能为空！'
               })
           }
        }).catch(() => {
            this.form.level='';
            this.form.name='';
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      delLevel(e){//删除部门
        this.$confirm('确定删除该级别？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.load=true;
                var body={levelId:e.businessLevelId,companyId:this.companyId}
                this.$http.post(this.url.localhost+this.url.delLevel,body,{emulateJSON: true}).then((res)=>{
                    if(res.body.code==200){
                         this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                       this.getLevel(this.pageNum,this.pageSize)
                    }else{
                        this.$message({
                            type: 'error',
                            message: '删除失败！'
                        });
                    }
                })
           
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
      },
      addLevel(){
        this.appendLevel=true;
        var body={companyId:this.companyId}
        this.$http.post(this.url.localhost+this.url.maxLevel,body,{emulateJSON:true}).then(res=>{
            if(res.body.code==200&&res.body.data!=null){
                this.form.level=res.body.data+1
            }
        })
      },
    //   page
    pageSizeChange(val){
        this.getLevel(val,this.pageSize)
    },
    pageCurrentChange(val){
        this.getLevel(val,this.pageSize)
    },
    levelAndName(row, column, cellValue, index){
        return row.businessLevelNum+"级/"+cellValue
    }
  }
}
</script>
<style scoped>
.level{
    width: 100%;
    height:100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
.pagimg{
    height: .56rem;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: .5rem;
    box-sizing: border-box;
}
.pagimg>div{
    display:flex;
}
.add{
    height: 0.56rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
