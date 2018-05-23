<template>
<div class="department">
       <el-table v-loading="load"  :data="department" style="width: 100%;height:85vh;"  class="table">
            <el-table-column prop="businessDepartName" label="部门" ></el-table-column>
            <el-table-column prop="businessDepartEmpnum"  label="人数" ></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button @click="changeDepartment(scope.row)" type="text" size="small"><img src="../assets/bianji.png" alt=""></el-button>
                    <el-button @click="delDep(scope.row)" type="text" size="small"><img src="../assets/shanchu.png" alt=""></el-button>
                </template>
            </el-table-column>
        </el-table>
              <el-row type="flex">
                <el-col class="add"><el-button type="text" @click="addDepartment">添加新部门</el-button></el-col>  
    </el-row> 
    <div class="block pagimg">
        <!-- <div class="departMsg">
            <span>部门：共{{}}个</span>
        </div> -->
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="pageCurrentChange"
      :current-page="nowPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</div>
</template>
<script>
import store from '../vuex/store'
export default {
  data(){
      return {
        department:[],//部门
        companyId:null,
        url:null,
        pageNum:1,
        pageSize:15,
        total:null,
        nowPage:1,
        load:true,
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
        if(val==21){
            this.getDepart(this.pageNum,this.pageSize)
        }
      }
  },
  methods:{
      getDepart(pageNum,pageSize){
         var url=store.state;
      var body={
          companyId:this.companyId,
          pageNum:pageNum,
          pageSize:pageSize
      }
       this.$http.post(this.url.localhost+this.url.getDepart, body,
        // 需要配置一下
        {emulateJSON: true}).then( (res) => {
        if(res.body!=""&&res.body.code==200){
            this.loadTable=false;
            var data=res.body.data;
            // console.log(data)
            this.department=data.list;
            this.total=data.total;
            this.load=false;
        }else{
            this.$message({
                 type: 'error',
                 message: res.body.message
            })
        }
    }, (err) => {
        console.log(err)
    })
      },
      addDepartment(){//添加新部门
        this.$prompt('请输入部门名称', '添加部门', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            var url=store.state.api;
            var body={
                companyId:this.companyId,
                departName:value
            }
           this.$http.post(this.url.localhost+this.url.addDepart, body,{emulateJSON: true}).then((res)=>{
               if(res.body.code==200&&res.body.message=="SUCCESS"){
                    this.$message({
                        type: 'success',
                        message: '添加成功！'
                    });
                    this.getDepart(this.pageNum,this.pageSize)
               }else{
                    this.$message({
                        type: 'error',
                        message: res.body.message
                    });
               }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        })
      },
      changeDepartment(e){//修改名称
        var that=this;
        this.$prompt('请输入部门名称', '修改部门名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            var body={
                departId:e.businessDepartId,
                departName:value
            }
              this.$http.post(this.url.localhost+this.url.updateDepart, body,{emulateJSON: true}).then((res)=>{
               if(res.body.code==200&&res.body.message=="SUCCESS"){
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    });
                     this.getDepart(this.pageNum,this.pageSize)
               }else{
                    this.$message({
                        type: 'error',
                        message: res.body.message
                    });
               }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      delDep(e){//删除部门
        this.$confirm('确定删除该部门？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.load=true;
                var body={departId:e.businessDepartId}
                this.$http.post(this.url.localhost+this.url.delDepart,body,{emulateJSON: true}).then((res)=>{
                    if(res.body.code==200&&res.body.message=="SUCCESS"){
                         this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                       this.getDepart(this.pageNum,this.pageSize)
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.body.message
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
    //   page
    pageSizeChange(val){
        this.getDepart(val,this.pageSize)
    },
    pageCurrentChange(val){
        this.pageNum=val;
        this.getDepart(val,this.pageSize)
    }
  }
}
</script>
<style scoped>
.department{
    width: 100%;
    height:100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

</style>
