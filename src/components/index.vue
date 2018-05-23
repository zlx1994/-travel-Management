<template>
  <div class="con">
    <el-container>
      <el-aside class="mediaL" :style="menuBoxStyle" style="width:16.35%;">
        <div class="left">
          <div class="logoBox">
            <div class="logo"><img src="../assets/logo.png" alt=""></div>
            <div class="title">佳阳科技差旅管理</div>
          </div>
      <el-row type="flex" class="row-bg">
        <el-col :span="24">
          <div class="menu left_menu">
              <div @click="tabChange($event,0)" :style="ind==0?menuStyle:''" :id="0"><img class="left_title_icon" src="../assets/liebiao.png" alt="">员工列表</div>
              <div @click="tabChange($event,1)" :style="ind==1?menuStyle:''" :id="1"><img class="left_title_icon" src="../assets/guanli.png" alt="">差旅管理</div>
              <div class="setBtn" @click="tabChange($event,2)" :id="2">
                <div ><img  class="left_title_icon" src="../assets/shezhi.png" alt="">设置</div>
                <div><img :style='rotate'  class="left_jt" src="../assets/jiantou.png" alt=""></div>
              </div>
          </div>
           <transition name="el-zoom-in-top">
           <div class="setting" v-show="setting">
                <div @click="tabChange($event,21)" :style="ind==21?menuStyle:''">部门设置</div>
                <div @click="tabChange($event,22)" :style="ind==22?menuStyle:''">级别设置</div>
                <div @click="tabChange($event,23)" :style="ind==23?menuStyle:''">出差标准</div>
              </div>
           </transition>
        </el-col>
    </el-row>
    </div>
      </el-aside>
    <el-main style="padding:0;">
      <div class="right">
          <div class="content">
            <!-- 员工列表 -->
            <employeelist v-show="rightShow==0" v-bind:ind="ind"></employeelist>
            <management v-show="rightShow==1" v-bind:ind="ind"></management>
            <!-- 差旅管理 -->
            <!-- 设置 部门设置-->
            <div class="employeeList settingDepart" v-show="rightShow==21">
                 <addDepartment :ind="ind"></addDepartment>
            </div>
            <!-- 设置  级别设置-->
            <level v-show="rightShow==22" v-bind:ind="ind"></level>
            <!-- 设置  出差标准-->
            <standards class="employeeList settingDepart"  :ind="ind" v-show="rightShow==23"></standards>
            <!-- 设置结束 -->
          </div>
      </div>
      
    <!-- </transition> -->
     </el-main>
    </el-container>
    <el-button type="primary" class="slide" :style="btnStyle" :icon="icon" @click='slideMenu'></el-button>
  </div>
</template>

<script>
import store from '../vuex/store'
import employeelist from './employeelist'
import addDepartment from './adddepartment'
import level from './levelSetting'
import management from './management'
import standards from './standards'
export default {
  name: 'HelloWorld',
  data () {
    return {
      menu:[{logo:require('../assets/liebiao.png'),title:'员工列表'},{logo:require('../assets/guanli.png'),title:'差旅管理',},{logo:require('../assets/shezhi.png'),title:'设置',jt:require('../assets/jiantou.png')}],
      menuStyle:'background:#16508d;',
      icon:'el-icon-d-arrow-right',
      rotate:'',//旋转箭头
      employeeListVisible:true,//员工列表
      employeeStramVisible:false,//差旅管理
      setIngVisible:false,//设置
      currentSteamNum:'',//当前操作流号
      isApprovers:true,
      ind:'0',
      loadTable:true,
     stramEmpVisible:true,
      checked:false,
      checked1:false,
      checked2:false,
      checked3:false,
      dialogVisible: false,
      dialogVisible1:false,
      dialogVisible2:false,
      dialogVisible3:false,
      multipleSelection: [],
      multipleSelection2: [],
       peopleNum:0,//员工总人数
      aprover:0,//审批人数
      currentPage:1,
      small:true,//分页显示大小
      pageSize:10,//每页显示个数
     
       pages:0,//总页数
      multipleSelection:[],//存储选中的数组
      companyId:2,
      setting:false,//菜单里的设置
      rightShow:0,//右侧列表简单显示
      radio:false,
      menuBoxStyle:'',
      btnStyle:"",
    }
  },
  components:{addDepartment,employeelist,level,management,standards},
  created(){
      var info=localStorage.getItem('key')
    if(info==null){
      this.$router.push({name:'login',params:{"login":'true'}})
    }
  },
  mounted:function(){
    // this.mainTable(1);
    // fetch(host+list,opt).then(function(res){
    //   console.log(res.json())
    // })
  },
  methods:{
     mainTable:function(no){
        var that=this;
        // console.log(store.state)
        var host=store.state.api.localhost;
        var list=store.state.api.list;
        var body={
            companyId:that.companyId,
            size:that.pageSize,
            page:no
          }
    },
    steamTable:function(no){
        var that=this;
        // console.log(store.state)
        var host=store.state.api.localhost;
        var list=store.state.api.allList;
        var body={
            companyId:that.companyId,
            size:that.pageSize,
            page:no
          }
      // console.log(opt)
      this.$http.post(host+list, body,
        // 需要配置一下
        {emulateJSON: true}).then( (res) => {
        // console.log(res.body)
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
       that.stramEmpVisible=false;
    }, (err) => {
        console.log(err)
    })
    },
    slideMenu(){//改变menu位置
      if(this.icon=="el-icon-d-arrow-right"){
        this.icon="el-icon-d-arrow-left";
        this.menuBoxStyle='left:0;width:30%;'
        this.btnStyle="left:30%;"
      }else{
        this.icon="el-icon-d-arrow-right";
        this.menuBoxStyle='left:-30%;'
        this.btnStyle="left:0;"
      }
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
    tabChange:function(e,i){
      e=e||event;
      // console.log(e)
      this.ind=i
      var that=this;
      switch (this.ind){
        case 0:
          
          that.rightShow=0;
        break;
        case 1:
          that.rightShow=1;
        break;
        case 2:
          this.setting=!this.setting;
          if(this.rotate==''){
            this.rotate='transform:rotate(90deg);transition:all .3s ease;'
          }else{
            this.rotate=''
          }
        break;
        case 21:
          that.rightShow=21;
          break;
          case 22:
          that.rightShow=22;
          break;
          case 23:
          that.rightShow=23;
          break;
      }
    },
   
    //添加员工
    addUser(form1){
      
            var that =this;
            var host=store.state.api.localhost;
            var queryKey=store.state.api.addUser;
            var body={
                businessEmpCompid:that.companyId,
                businessEmpName:that.form1.name,
                businessEmpNum:that.form1.num,
                businessEmpDet:that.form1.det,
                businessEmpLevel:that.form1.lv.split('-')[0],
                businessPostion:that.form1.lv.split('-')[1],
            }
          this.$refs[form1].validate((valid) => {
          if (valid) {
              this.$http.post(host+queryKey, body,
            // 需要配置一下
              {emulateJSON: true}).then( (res) => {
              // console.log(res.body)
              if(res.body!=""&&res.body.code==200)
              that.loadTable=false;
              that.dialogVisible1=false;  
              // that.form1.name='';
              //  that.form1.num='';
             this.clickClnce(form1);
               this.mainTable(that.currentPage);
              this.successMessage("添加成功！！");
              }, (err) => {
              console.log(err)
              }) 
              
          } else {
          //  this.faildMessage("请正确填写表单");
          this.$message("请正确填写表单");
            return false;
          }
        });
    },
      //page changed
    handleSizeChange:function(val){
         var likeThis=this;
         var pageSize = val;
         this.currentPage=1
         this.pageSize=pageSize;
         this.mainTable(val)
    },
    
    handleCurrentChange:function(val){
           this.mainTable(val)
    },  
    //员工列表删除
   
    //审核流操作
    steamClick(o,num){
        //
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
          // console.log(res.body.data)
          if(res.body!=""&&res.body.code==200){
             that.loadTable=false;
          
              that.employeeStramVisible=false;  


              that.steamEmpTable=res.body.data.list;
              that.currentSteamNum=res.body.data.list[0].teamNum;
              that.stramEmpVisible=true; 
              that.pages=res.body.data.pages;
              that.peopleNum=res.body.data.total;
            
          }else{
            this.faildMessage("系统繁忙，请刷新重试！")
          }
         
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新重试！")
          })      
      
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
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
              this.steamClick(null,o.row.teamNum)
               this.successMessage("删除成功");
          }     
          else{
               this.faildMessage("系统繁忙，请刷新重试！")
          }
          }, (err) => {
            this.faildMessage("系统繁忙，请刷新！")
          })      



    },
    //返回差旅页面
    voidMainSteamPage(){
       this.steamTable(1);
       this.currentSteamNum='',//当前操作流号
       this.employeeListVisible=false
       this.setIngVisible=false;
       this.employeeStramVisible=true;
       this.stramEmpVisible=false;
    },
    
    
    //批量删除流下的员工
    deleteSteamList(){
      var ob=this.multipleSelection;
      console.log(ob)
      if(ob.length==0){
            this.warningMessage("请勾选要删除的员工！！")
            return false;
      }
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
        this.$http.post(host+url, body,
        // 需要配置一下
          {emulateJSON: true}).then( (res) => {
          console.log(res.body)
          if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
            
             this.successMessage("添加成功！")
             this.dialogVisible3 = false
             this.voidMainSteamPage()
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
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.con{width: 100%;height: 100%;background: #f1f1f1;display: flex;justify-content: space-between;}
.mediaL{width: 16.35%;}
.left{height: 100%;background: linear-gradient(0deg,#71b7f2 0%, #2267b4 100%);}
.logoBox{padding: 0.9rem 0;box-sizing: border-box;display: flex;flex-direction: column;justify-content: center;align-items: center;}
.logo{width: 1.33rem;height: 1.33rem;margin-bottom: 0.2rem;}
.logo img{width: 1.33rem;height: 1.33rem;}
.title{font-size: 0.2rem;color: #ffffff;}
.menu{width: 100%;}
.menuList{height:0.8rem;box-sizing: border-box;display: flex;justify-content: center;align-items: center;font-size: 0.16rem;color: #fff;}
.menuList:last-child{justify-content: space-between;padding:0 0.2rem 0 27%;}
.menuList_icon{width:45%;height: 100%;display: flex;align-items: center;white-space: nowrap;}
.menuListIcon{width: 0.2rem;height: .2rem;margin-right: 0.3rem;}
.menuStyle{background:#16508d;}
.right{height:100%;position: relative;}
.content{width: 100%;height: 100%;}
.left_jt{transition:all .3s ease;}
.setBtn div:first-child,.setBtn div:last-child{height: 100%;display: flex;align-items: center;}
/*员工列表样式*/
.employee{width: 100%;}
.employee .selection{position: relative;width: 10px;}
.rightB{width: 100%;height: 0.56rem;background: #fff;position:absolute;bottom:0;display:flex;justify-content: space-between;align-items: center;font-size: .14rem;color: #333;padding-right: .8rem;box-sizing: border-box;}
.missEmp{width:1.2rem;height: 100%;line-height: 0.56rem; background: #999;color: #fff;}
.setting div{padding-left: 7%;}
.steamEmpBox{width:1.8rem;height: 100%;line-height: 0.56rem;display: flex; justify-content: space-between;align-items: center;padding:7px}
.settingDepart{height: 100%;}
.slide{width: 30px;height: 50px;display: flex;justify-content: center;align-items: center;position: absolute;top: 50%;left: 0;display: none;z-index: 50001;transition:all .3s ease-in-out;}
</style>
