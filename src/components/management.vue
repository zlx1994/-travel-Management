<template>
<div>
    <div class="top">
      <el-button type="primary" size="small" :disabled="!showEmployee" style="text-align:left;" plain @click="returnShow" >返回</el-button>
    </div>
   <div class="employeeList" v-show="!showEmployee" >
              <el-table v-loading='loadTable' height="85vh" class="employee"  ref="multipleTable1" :data="employeeSteam" style="width: 100%;color:#fff;" @selection-change="handleSelectionChange1">
                <el-table-column type='selection' class="selection" placeholder="全选"  width='100' >
                  <el-checkbox v-model="checked2"></el-checkbox>
                </el-table-column>
                <el-table-column  label="批号" prop="teamNum" width="100px"> </el-table-column>
                <el-table-column prop="businessEmp.businessEmpName" label="审批人" >  </el-table-column>
                <el-table-column prop="businessEmp.businessEmpNum" label="编号"> </el-table-column>
                <el-table-column prop="businessDepart" label="部门"> </el-table-column>
                <el-table-column prop="businessEmp.businessEmpLevel" label="级别"> </el-table-column>
                 <el-table-column prop="empSize" label="审批人数(个)"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="steamClick(scope.row)" type="text" size="small">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 添加审核 -->
              <el-dialog title="添加审核" :visible.sync="dialogVisible3" :before-close="handleClose">
                <template>
                  <el-table
                    :data="ableEmp"
                    height="250"
                    border
                    style="width: 100%"  ref="multipleTable2"  @selection-change="handleSelectionChange2" >
                    <el-table-column  label="序号" type="index" width="50px"> </el-table-column>
                    <el-table-column prop="businessEmpName" label="姓名" >  </el-table-column>
                    <el-table-column prop="businessEmpNum" label="编号"> </el-table-column>
                    <el-table-column prop="businessEmpDet" label="部门"> </el-table-column>
                    <el-table-column prop="businessEmpLevel" label="级别"> </el-table-column>
                    <el-table-column type='selection' class="selection" placeholder="全选"  width='100' >
                      <el-checkbox v-model="checked3"></el-checkbox>
                    </el-table-column>
                  </el-table>
                </template>
                 <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addSteam()">确认</el-button>
                    <el-button  @click="dialogVisible3 = false,steamTable(1)">取 消</el-button>
                  </div>
              </el-dialog>
            </div>
            <!-- 默认显示 审批人列表-->
             <div class="employeeList" v-show="showEmployee">
              <el-table v-loading='loadTable' ref="multipleTable" height="85vh" class="employee" :data="steamEmpTable" style="width: 100%;color:#fff;"  @selection-change="handleSelectionChange">
                <el-table-column type='selection' class="selection" placeholder="全选" prop="steanDel" width='100' >
                  <el-checkbox v-model="checked"></el-checkbox>
                </el-table-column>
                <el-table-column  label="批号" prop="teamNum" width="100px"> </el-table-column>
                <el-table-column prop="businessEmp.businessEmpName" label="姓名" :formatter="formatName">  </el-table-column>
                <el-table-column prop="businessEmp.businessEmpNum" label="编号"> </el-table-column>
                <el-table-column prop="businessDepart" label="部门"> </el-table-column>
                <el-table-column prop="businessEmp.businessEmpLevel" label="级别"> </el-table-column>
                 <el-table-column  label="权限设置"> 
                    <template  slot-scope="scope":inline="true" >
                      <el-checkbox v-model="radio" v-if="scope.row.isApprovers" @change="approverMe(scope.row)">被审批</el-checkbox>
                      <el-button @click="pisserm(scope.row,0)" v-if="scope.row.isApprovers"  type="text" size="small">取消审核权限 </el-button>
                       <el-button @click="pisserm(scope.row,1)" v-if="!scope.row.isApprovers"  type="text" size="small">授权审核权限 </el-button>
                    </template>
                 </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="deleteSteamEmp(scope)" type="text" size="small"><img src="../assets/shanchu.png" title="删除"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 加入员工 -->
              <el-dialog title="加入员工" :visible.sync="dialogVisible2" :before-close="handleClose">
                <template>
                  <el-table
                    :data="ableEmp"
                    height="250"
                    border
                    style="width: 100%">
                    <el-table-column  label="序号" type="index" width="50px"> </el-table-column>
                    <el-table-column prop="businessEmpName" label="姓名" >  </el-table-column>
                    <el-table-column prop="businessEmpNum" label="编号"> </el-table-column>
                    <el-table-column prop="businessEmpDet" label="部门"> </el-table-column>
                    <el-table-column prop="businessEmpLevel" label="级别"> </el-table-column>
                    <el-table-column label="操作" >
                      <template slot-scope="scope">
                         <el-button type="text"  icon="el-icon-circle-plus-outline" style="color:#069225" @click="addSteamEmp(scope)">加入</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                 <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible2 = false,steamTable(0)">确认</el-button>
                    <el-button  @click="dialogVisible2 = false,steamTable(0)">取 消</el-button>
                  </div>
              </el-dialog>
              <!-- -->
             </div>
             <!--  底部信息-->
            <div class="rightB">
              <div class="steamEmpBox">
                 <el-button @click="!showEmployee?showableEmpTable(1):showableEmpTable(0)"  type="primary" size="small">{{!showEmployee?'添加审核':'加入'}}</el-button>
                 <el-button @click="!showEmployee?delAllSteam():deleteSteamList()"  type="info" style="" size="small">批量删除</el-button>
              </div>
              <div class="pagemsg">
                <div class="personnel">
                  <div class="pageNum">共{{pages}}页</div>
                </div>
                <div class="operation">
                  <div class="block">
                    <!-- <span class="demonstration">直接前往</span> -->
                    <!-- <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange"  :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="pages"> </el-pagination> -->
                    <!-- :page-sizes="pageSizesList" -->
                    <el-pagination
                      class="pull-right clearfix"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage"
                      
                      :page-size="pageSize"
                      layout="total,  prev, pager, next, jumper"
                      :total="peopleNum">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
</div>
</template>

<script>
import store from '../vuex/store'
export default {
  data(){
      return {
        loadTable:true,
        showEmployee:false,
        employeeSteam:[],//审批流列表
        checked:false,
        checked1:false,
        checked2:false,
        checked3:false,
        dialogVisible: false,
        dialogVisible1:false,
        dialogVisible2:false,//审核人添加员工列表显示
        dialogVisible3:false,//添加审核人列表
        ableEmp:[],//可加入员工列表
        steamEmpTable:[],//审批流下员工
        pages:0,//总页数
        currentPage:1,
        pageSizesList: [10, 15, 20],
        pageSize:10,//每页显示个数
        peopleNum:0,//员工总人数
        multipleSelection2:[],
        multipleSelection1: [],
        multipleSelection:[],
        currentSteamNum:'',//当前操作流号
        page:1,
      }
  },
  created(){
    this.url=store.state.api;
    this.companyId=store.state.userInfo.companyId;
  },
  props:['ind'],
   watch:{
      ind(val,oldVal){
        if(val==1){
            this.steamTable(this.page)
        }
      }
  },
  methods:{
     steamTable:function(pages){//获取所有审批人列表
        var that=this;
        this.showEmployee=false;        // console.log(store.state)
        var host=store.state.api.localhost;
        var list=store.state.api.allList;
        var body={
            companyId:that.companyId,
            size:that.pageSize,
            page:pages
          }
      // console.log(opt)
      this.$http.post(host+list, body,
        // 需要配置一下
        {emulateJSON: true}).then( (res) => {
        console.log(res.body)
        if(res.body!=""&&res.body.code==200)
        that.loadTable=false;
        var data=res.body.data;
        // var employee=data.list;
         that.employeeSteam=data.list;
         that.pages=data.pages;
         that.peopleNum=data.total;
         that.currentPage=data.pageNum;

         this.employeeListVisible=false
       this.setIngVisible=false;
       this.employeeStramVisible=true;
      //  that.stramEmpVisible=false;
    }, (err) => {
        console.log(err)
    })
    },
     //审核流操作
    steamClick(o,num){
        //
        this.showEmployee=true;
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.steamList;
        that.currentPage=1;
        var body={
            page:that.currentPage,
            size:that.pageSize,
            companyId:that.companyId,
            steamNum:num==null?o.teamNum:num
        }
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body.data)
          if(res.body!=""&&res.body.code==200){
             that.loadTable=false;
              that.employeeStramVisible=false;  
              that.steamEmpTable=res.body.data.list;
              that.currentSteamNum=res.body.data.list[0].teamNum;
              // that.stramEmpVisible=true; 
              that.pages=res.body.data.pages;
              that.peopleNum=res.body.data.total;
            
          }else{
            this.faildMessage("系统繁忙，请刷新重试！")
          }
         
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新重试！")
          })      
          console.log(body)
    },
    //删除审批流下员工
    deleteSteamEmp(o){
       console.log(o)
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.delete;
        var body={
           steamIds: o.row.steamId
        }
         this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(host+url, body,
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
              this.steamClick(null,o.row.teamNum)
               this.$message({message:"删除成功",type:'success'});
          }     
          else{
               this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //设置审核自己
    approverMe(o){
        
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.approverMe;
        var body={
          key:this.radio?1:0,
          steamId:o.steamId
        }
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
          this.successMessage("设置成功！")
          }     
          else if(res.body!=""&&res.body.code==201){
               this.faildMessage(res.body.message)
          }else{
            this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          }) 
    },
    //授权权限
    pisserm(o,s){
      
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.pisserm;
        var body={
          key:s==0?1:2,
          steamId:o.steamId,
          steanNum:that.currentSteamNum
        }
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
                   that.steamClick(null,that.currentSteamNum);
          this.successMessage("设置成功！")
          }     
          else if(res.body!=""&&res.body.code==201){
               this.faildMessage(res.body.message)
          }else{
            this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          }) 
    },
    faildMessage(mes){
         this.$message({
          showClose: true,
          duration:2000,
          message: mes,
          type: 'error'
        });
    },
    returnShow(){//返回操作
        this.showEmployee=false;
         this.steamTable(this.page)
    },
       handleSelectionChange(val){
      this.multipleSelection=val
    },
     handleSelectionChange1(val){
      this.multipleSelection1=val
    },
     handleSelectionChange2(val){
      this.multipleSelection2=val
    },
      //对话框 点X 关闭
    handleClose:function(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },

    handleCurrentChange:function(val){
           this.mainTable(val)
    },
    //显示可加入员工
    showableEmpTable(states){
      console.log(states)
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.emp;
        var body={
           state:0,
           compId:that.companyId
        }
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
             that.loadTable=false;
             that.ableEmp=res.body.data.list;
          }     
          else{
               this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          })      
        states==0?this.dialogVisible2=true:this.dialogVisible3=true
        // states==1?this.dialogVisible2=true:this.dialogVisible3=false
    },

    formatName:function(row,column){
      var name =row.businessEmp.businessEmpName;
      if(row.isApprovers==true&&row.nextHigher==-1){
          this.radio=true;
      }
      return row.isApprovers ?name+" (审核人)" :name;
    },
      //page changed
    handleSizeChange:function(val){
         var likeThis=this;
         var pageSize = val;
         this.currentPage=1
         this.pageSize=pageSize;
         this.mainTable(val)
        
      
    },
    //删除审核流
    delAllSteam(){
      var ob=this.multipleSelection1;
      console.log(ob)
      if(ob.length==0){
            this.$message({message:"请勾选要删除的审核流！！",type:'warning'})
            return false;
      }
     this.$message({message:"所选的审核流审核人数不为0，不可删除！！",type:'warning'})
      return false;
    },
    addSteamEmp(o){//添加到审核流中
         console.log(o)  
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.add;
        var body={
          steamNum:that.currentSteamNum,
          emps:o.row.businessEmpId
        }
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
            that.showableEmpTable(0);
            // this.showEmployee=false;
             this.successMessage("添加成功！")
          }     
          else if(res.body!=""&&res.body.code==201){
               this.faildMessage(res.body.message)
          }else{
            this.$message({message:"系统繁忙，请刷新重试！",type:"error"})
          }
          }, (err) => {
            this.$message({message:"系统繁忙，请刷新！",type:'error'})
          })  

    },
   //批量删除流下的员工
    deleteSteamList(){
      var ob=this.multipleSelection;
      console.log(ob)
      if(ob.length==0){
            this.$message({message:"请勾选要删除的员工！！",type:'warning'})
            return false;
      }else{
         this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var text='';
      for(var i =0;i<ob.length;i++){
         if(i!=ob.length-1){
            text+=ob[i].steamId+','
         }else{
           text+=ob[i].steamId
         }

      }
      
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.delete;
        var body={
         steamIds:text
           
        }
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
           

           that.steamClick(null,that.currentSteamNum);
             this.successMessage("删除成功！")
          }     
          else if(res.body!=""&&res.body.code==201){
               this.faildMessage(res.body.message)
          }else{
            this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          }) 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
      
          }
    },
    //添加审核流
    addSteam(o){

      var ob=this.multipleSelection2;
      if(ob.length==0){
            this.warningMessage("请勾选加入新审核流员工！！")
            return false;
      }
      var text='';
      for(var i =0;i<ob.length;i++){
         if(i!=ob.length-1){
            text+=ob[i].businessEmpId+','
         }else{
           text+=ob[i].businessEmpId
         }

      }
        var that =this;
        var host=store.state.api.localhost;
        var url=store.state.api.add;
        var body={
            emps:text
        }
       console.log(host +'********'+ url)
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
            
             this.successMessage("添加成功！")
             this.dialogVisible3 = false;
             this.dialogVisible2=false;
             this.steamTable(this.page)
          }     
          else if(res.body!=""&&res.body.code==201){
               this.faildMessage(res.body.message)
          }else{
            this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          })  
    },
     successMessage(mes){
        this.$message({
          showClose: true,
          duration:2000,
          message:mes,
          type: 'success'
        });
    },
    faildMessage(mes){
         this.$message({
          showClose: true,
          duration:2000,
          message: mes,
          type: 'error'
        });
    },
    warningMessage(mes){
      this.$message({
          message: mes,
          duration:2000,
          type: 'warning'
        });
    },
  }
}
</script>
<style scoped>
.top{
  display: flex;
  height: .8rem;
  justify-content: flex-start;
  align-items: center;
  padding-left: .6rem;
  box-sizing: border-box;
}
.top button{

}
</style>