<template>
  <div class="employee">
      <div class="con_top"  >
              <div class="con_top_list" v-for='(item,index) in rightNav' :style='navIndex==index?navStyle:""' @click="choosePower($event,index,item.img)">
                <div class="con_top_list_icon"><img :src="item.img" alt=""></div>
                <div>{{item.title}}</div>
              </div>
              <div class="con_top_list" :style='delStyle' @click='delAll'>
                <div class="con_top_list_icon"><img src="../assets/sch.png" alt=""></div>
                全部删除
              </div>
            </div>
            <a id="downlink"></a>
            <div class="employeeList" >
              <el-table v-loading='loadTable' height="85vh" ref="multipleTable" class="employee" :data="employee" style="width: 100%;color:#fff;" @selection-change="selectionChangeAll">
                 <el-table-column type='selection' class="selection" placeholder="全选" prop="delEmp" width='100'  >
                  <el-checkbox v-model="checked1"></el-checkbox>
                </el-table-column>
                <el-table-column  label="序号" type="index" width="50px"> </el-table-column>
                <el-table-column prop="businessEmpName" label="姓名" >  </el-table-column>
                <el-table-column prop="businessEmpNum" label="编号"> </el-table-column>
                <el-table-column prop="businessEmpDet" label="部门"> </el-table-column>
                <el-table-column prop="businessEmpLevel" label="级别"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="changeEmp(scope.row)" type="text" size="small"><img src="../assets/bianji.png" alt="修改"></el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small"><img src="../assets/shanchu.png" alt="删除"></el-button>
                  </template>
                </el-table-column>
               
              </el-table>
                <!-- 快速查询 -->
                <el-dialog title="快速查询" :visible.sync="dialogVisible" :before-close="handleClose">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                  <el-form-item label="关键字" prop="key">
                    <el-input v-model="form.key"></el-input>
                  </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="queryUser('form')">查 询</el-button>
                    <el-button  @click="dialogVisible = false,clickClnce('form')">取 消</el-button>
                  </div>
                </el-dialog>
               
                <!-- 添加员工 -->
                <el-dialog title="添加员工" :visible.sync="dialogVisible1" :before-close="handleClose">
                <el-form ref="form1" :model="form1":rules="rules" label-width="80px">
                  <el-form-item label="姓名"  prop="name" >
                    <el-input v-model="form1.name" placeholder="请填写姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="编号" prop="num" >
                    <el-input v-model="form1.num" placeholder="请填写编号"></el-input>
                  </el-form-item>
                  <el-form-item label="部门" prop="det">
                    <el-select v-model="form1.det" placeholder="请选择部门">
                      <el-option v-for="item in compDet"
                        :key="item.businessDepartId"
                        :label="item.businessDepartName"
                        :value="item.businessDepartId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="级别"  prop="lv">
                     <el-select v-model="form1.lv" placeholder="请选择级别">
                      <el-option v-for="items in compLv"
                        :key="items.businessLevelId"
                        :label="items.businessLevelNum"
                        :value="items.businessLevelId+'-'+items.businessLevelName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addUser('form1')">添 加</el-button>
                    <el-button  @click="dialogVisible1 = false,clickClnce('form1')">取 消</el-button>
                  </div>
                </el-dialog>
            
            </div>
            <div class="rightB">
              <div class="missEmp" @click="getMiss">遗漏员工</div>
              <div class="pagemsg">
                <div class="personnel">
                  <div class="approvalPerson">审批人：{{aprover}}人</div>
                  <div class="allEmployee">全部员工：{{peopleNum}}人</div>
                  <div class="pageNum">共{{pages}}页</div>
                </div>
                <div class="operation">
                  <div class="block">
                    <!-- <span class="demonstration">直接前往</span> -->
                    <!-- <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange"  :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="pages"> </el-pagination> -->
                    <!-- :page-sizes="pageSizesList" -->
                    <el-pagination
                      class="pull-right clearfix"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="page"
                      
                      :page-size="pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="peopleNum">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
            <!-- 修改员工 -->
            <el-dialog title="修改员工信息" center :visible.sync="changeEmpMsg">
            <el-form :model="empForm" :label-position="right" >
              <el-form-item label="姓名:" :label-width="formLabelWidth">
                <el-input v-model="empForm['businessEmp.businessEmpName']" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="编号:" :label-width="formLabelWidth">
                <el-input v-model="empForm['businessEmp.businessEmpNum']" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="部门:" :label-width="formLabelWidth">
                <!-- empForm['businessEmp.businessEmpDet'] -->
                <el-select v-model="empForm['businessEmp.businessEmpDet']" placeholder="请选择部门" @change="chooseDepart">
                  <el-option v-for='item in compDet' :label="item.businessDepartName" :key="item.businessDepartId" :value="item.businessDepartId">{{item.businessDepartName}}</el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="级别:" :label-width="formLabelWidth">
                <!-- empForm['businessEmp.businessEmpLevel'] -->
                <el-select v-model="empForm['businessEmp.businessEmpPosition']" placeholder="请选择级别" @change="chooseLevel">
                  <el-option v-for="item in compLv" :label="item.businessLevelName" :key="item.businessLevelId" :value="item.businessLevelId">{{item.businessLevelName}}</el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <div slot="footer" center class="dialog-footer">
              <el-button @click="changeEmpMsg = false">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
            </div>
            </el-dialog>
            <!-- 遗漏员工 -->
            <el-dialog class="missEmpBox" title="遗漏员工" :visible.sync="missEmpShow">
               <el-table v-loading='loadTable' ref="multipleTable" class="employee" :data="missEmpList" style="width: 100%;background:#666;color:#fff;" @selection-change="selectionChangeAll">
                 <!-- <el-table-column type='selection' class="selection" placeholder="全选" prop="delEmp" width='100'  >
                  <el-checkbox v-model="checked1"></el-checkbox>
                </el-table-column> -->
                <el-table-column  label="序号" type="index" width="50px"> </el-table-column>
                <el-table-column prop="businessEmpName" label="姓名" >  </el-table-column>
                <el-table-column prop="businessEmpNum" label="编号"> </el-table-column>
                <el-table-column prop="businessEmpDet" label="部门"> </el-table-column>
                <el-table-column prop="businessEmpLevel" label="级别"> </el-table-column>
              </el-table>
              <div class="block">
                <!-- <span class="demonstration">页数较少时的效果</span> -->
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="10"
                  @current-change="missPageChabge"
                  :page-count="missEmpPage"
                  :total="missEmpTotal">
                </el-pagination>
              </div>
            </el-dialog>
            <!-- 文件导入弹窗 -->
            <el-dialog title="选择文件" :visible.sync="fileShow">
                <div class="filebox">
                  <!-- <el-button type="text" @click="uploadFile()"></el-button> -->
                  请选择需要导入的文件
                  <input type="file"  id="fileLoad" ref="file" @change="importFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" auto-complete="off"></input>
                </div>
            </el-dialog>
            <el-dialog title="查看文件" class="showFile" :visible.sync="tableShow" >
               <el-table :data="excelData" height='50vh'>
                <el-table-column label="姓名" prop="name" ></el-table-column>
                <el-table-column label="编号" prop="number" ></el-table-column>
                <el-table-column label="部门" prop="depart" ></el-table-column>
                <el-table-column label="级别" prop="level" ></el-table-column>
                <el-table-column label="职位" prop="position" ></el-table-column>
              </el-table>
               <div slot="footer" class="dialog-footer">
                <el-button @click="tableShow = false">取 消</el-button>
                <el-button type="primary" @click="upload">确 定</el-button>
              </div>
            </el-dialog>
  </div>
</template>
<script>
import store from '../vuex/store'
import XLSX from 'xlsx'
export default {
  data(){
    return {
      excelData:[],//文件导入之后展示
        missEmpShow:false,
        missEmpTotal:0,//遗漏员工总数
        missEmpPage:1,//当前页
        rightNav:[{img:require('../assets/sousuo.png'),title:'快速查找'},{img:require('../assets/tianjia.png'),title:'添加员工'},{img:require('../assets/daoru.png'),title:'员工导入'},{img:require('../assets/daochu.png'),title:'员工导出'}],
        defaultImg:[require('../assets/sousuo.png'),require('../assets/tianjia.png'),require('../assets/daoru.png'),require('../assets/daochu.png')],
        changeImg:[require('../assets/sousuobai.png'),require('../assets/tianjiab.png'),require('../assets/daorub.png'),require('../assets/daochub.png')],
        navIndex:'',
        right:'right',//修改表单的显示居中
        changeEmpMsg:false,//修改员工信息
        stramEmpVisible:false,//审批流下的员工表
        loadTable:true,//是否显示loading
         employee:[],//员工列表
         pages:0,//总页数
        peopleNum:0,//员工总人数
        aprover:0,//审批人数
        page:1,
        small:true,//分页显示大小
        multipleSelection:[],//删除时需要的id数组
        pageSize:15,//每页显示个数
        navStyle:'',
        checked1:false,
        dialogVisible: false,
        dialogVisible1:false,
        dialogVisible2:false,
        dialogVisible3:false,
        formLabelWidth:'10%',
        compDet:[],
        compLv:[],
        delStyle:'',//顶部删除按钮样式
        missEmpList:[],
        fileShow:false,//文件显示弹窗
        tableShow:false,//文件table显示
        imFile:{},
        empForm:{
          
        },
        form: {
          key: '',
        },
        form1: {
          name: '',
          num: '',
          det: '',
          lv: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请输入编号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          det: [
            { required: true, message: '请选择具体值', trigger: 'change',type: 'number'  }
          ],
          lv: [
            { required: true, message: '请选择具体值', trigger: 'change' }
          ],
          key: [
           { required: true, message: '请输入要查询的值', trigger: 'blur' },
          ]
        }
     }
  },
  props:['ind'],
  created(){
      this.url=store.state.api;
      this.userInfo=store.state.userInfo;
  },
 
  mounted(){
    if(this.ind==0){
       this.getemployee(this.page)
       this.$http.post(this.url.localhost+this.url.getAllDepart,{companyId:this.userInfo.companyId},{emulateJSON:true}).then(res=>{
       if(res.body.code==200){
         this.compDet=res.body.data
       }
     })
     this.$http.post(this.url.localhost+this.url.queryLv,{companyId:this.userInfo.companyId},{emulateJSON:true}).then(res=>{
       if(res.body.code==200){
         this.compLv=res.body.data
       }
     })
    }
     this.imFile = document.getElementById('fileLoad')
     this.outFile = document.getElementById('downlink')
  },
  watch:{
      ind(val,oldVal){
        if(val==0){
            this.getemployee(this.page)
        }
      }
  },
  methods:{
     getemployee(pageNum){
         var body={
            companyId:this.userInfo.companyId,
            size:this.pageSize,
            page:pageNum
         }
         this.$http.post(this.url.localhost+this.url.list,body,{emulateJSON:true}).then(res=>{
             if(res.body!=""&&res.body.code==200)
                this.loadTable=false;
                var data=res.body.data;
                // var employee=data.list;
                this.employee=data.list;
                this.pages=data.pages;
                this.peopleNum=data.total;
                this.currentPage=data.pageNum;

                this.employeeListVisible=false
            this.setIngVisible=false;
            this.employeeStramVisible=true;
            this.stramEmpVisible=false;
            }, (err) => {
                console.log(err)
            })
        
     }, 
    choosePower:function(a,b,c){
      var navStyle='background:#3d7bbe;color:#fff;'
      this.navStyle=navStyle;
      this.navIndex=b;
      var that=this;
      var list=this.rightNav;
      console.log(list)

      list.forEach(function(item,index){
        if(b==index){
          that.rightNav[b].img=that.changeImg[b]
          console.log(index)
        switch (index){
          case 0:
            //快速查询
              that.dialogVisible=true;  
            break;
           case 1:
            //快速添加
             //获取部门
                  var host=store.state.api.localhost;
                  var url=store.state.api.queryDet;
                  var body={
                      companyId:that.userInfo.companyId,
                  }
                  that.$http.post(host+url, body,
                  // 需要配置一下
                    {emulateJSON: true}).then( (res) => {
                    if(res.body!=""&&res.body.code==200)
                    that.loadTable=false;
                     that.compDet=res.body.data;
                    }, (err) => {
                    console.log(err)
                    })
                 

             //获取级别
                  url=store.state.api.queryLv;
                  that.$http.post(host+url, body,
                  // 需要配置一下
                    {emulateJSON: true}).then( (res) => {
                    if(res.body!=""&&res.body.code==200)
                    that.loadTable=false;
                     that.compLv=res.body.data;

                    }, (err) => {
                    console.log(err)
                    })
               
              that.dialogVisible1=true;  
              
            break;
            case 2:
            that.fileShow=true;
            break;
            case 3:
            var list=that.employee;
            var newList=[];
            for (var key in list){
              var obj={
                '姓名':'张三',
                '编号':'',
                '部门':'',
                '职位':''
              };
              if(typeof obj[key]=='undefined'){
                obj['姓名']=list[key]['businessEmpName']
                obj['编号']=list[key]['businessEmpNum']
                obj['部门']=list[key]['businessEmpDet']
                obj['职位']=list[key]['businessEmpPosition']
              }
              newList.push(obj)
            }
           
            that.downloadFile(newList);
            break;
        }     


        }else{
          that.rightNav[index].img=that.defaultImg[index]
        }
      })
    },
  //快速查找
    queryUser(form){
      var that=this;
      var host=store.state.api.localhost;
      var queryKey=store.state.api.queryKey;
      var body={
          companyId:that.userInfo.companyId,
          key:that.form.key
      }
       this.$refs[form].validate((valid) => {
          if (valid) {
           this.$http.post(host+queryKey, body,
          // 需要配置一下
            {emulateJSON: true}).then( (res) => {
            if(res.body!=""&&res.body.code==200)
            that.loadTable=false;
            var data=res.body.data;
            var employee=data.list;
            that.employee=employee;
            that.pages=data.pages;
            that.peopleNum=data.total;
            that.dialogVisible=false;  
            that.form.key=''
            }, (err) => {
            console.log(err)
            })
          }else{
            this.$message("请正确填写表单");
              // this.faildMessage("请正确填写！！");
            return false;
          }
          })

    },
    //page changed
    handleSizeChange:function(val){
         var likeThis=this;
         var pageSize = val;
         this.currentPage=1
         this.pageSize=pageSize;
        this.getemployee(1,10)
    },
    //全选//全不选
    selectionChangeAll:function(rows) {
      var arr=[];
      rows.forEach(function(item){
        arr.push(item.businessEmpId)
      })
     this.multipleSelection=arr;
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
            this.getemployee(val)
    },
    //添加员工
    addUser(form1){
      
            var that =this;
            var host=store.state.api.localhost;
            var queryKey=store.state.api.addUser;
            var body={
                businessEmpCompid:that.userInfo.companyId,
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
              if(res.body!=""&&res.body.code==200)
              that.loadTable=false;
              that.dialogVisible1=false;  
              // that.form1.name='';
              //  that.form1.num='';
             this.clickClnce(form1);
               this.getemployee(that.currentPage);
              this.successMessage("添加成功！！");
              }, (err) => {
              console.log(err)
              }) 
              
          } else {
           this.faildMessage("请正确填写表单");
            return false;
          }
        });
    },
    clickClnce(form){
        this.$refs[form].resetFields();
    },
     handleClick(o){
           if(o.businessEmpState!=1){
            var that =this;
            var host=store.state.api.localhost;
            var url=store.state.api.deleteUser;
            var body={
                id:o.businessEmpId
            }
            this.$http.post(host+url, body,
            // 需要配置一下
              {emulateJSON: true}).then( (res) => {
              if(res.body!=""&&res.body.code==200){
                 that.loadTable=false;
                this.getemployee(this.page)
                // this.mainTable(that.currentPage);
                this.successMessage("删除成功！！");
              }else{
                 this.faildMessage("系统繁忙，请刷新！")
              }
                   
              }, (err) => {
                this.faildMessage("系统繁忙，请刷新！")
              })      
           }else{
             this.faildMessage("该员工已在审批流中，无法删除！！");
           }
    
    },
    changeEmp(e){//修改员工信息
      this.changeEmpMsg=true;
      var data={
        "businessEmp.businessEmpCompid":e.businessEmpCompid,
        "businessEmp.businessEmpDet":e.businessEmpDet,
        "businessEmp.businessEmpId":e.businessEmpId,
        "businessEmp.businessEmpLevel":e.businessEmpLevel,
        "businessEmp.businessEmpName":e.businessEmpName,
        "businessEmp.businessEmpNum":e.businessEmpNum,
        "businessEmp.businessEmpPosition":e.businessEmpPosition,
        "businessEmp.businessEmpState":e.businessEmpState
      }
      this.empForm=data;
    },
    //遗漏员工
    getMiss(){
      this.missEmpShow=true;
      var body={
        page:this.missEmpPage,
        size:10,
        compId:this.userInfo.companyId,
        state:0
      }
    this.$http.post(this.url.localhost+this.url.emp,body,{emulateJSON:true}).then(res=>{
      if(res.body.code==200){
        this.missEmpList=res.body.data.list;
        this.missEmpTotal=res.body.data.total;
        this.missEmpPage=res.body.data.pages;
      }
    })       
    },
    delAll(){
      console.log(this.page)
      if(this.multipleSelection.length<=0){
        this.warningMessage('未选择，请选择后重试！')
      }else{
         this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var b=this.multipleSelection.join(',')
        var body={
          ids:b
        };
        this.$http.post(this.url.localhost+this.url.deleteAll,body,{emulateJSON:true}).then(res=>{
          if(res.body.code==200){
              this.$message({
            type: 'success',
            message: '删除成功!'
          });
           this.getemployee(this.page)
          }else{
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      }
    },
    missPageChabge(val){
      this.missEmpPage=val
       this.getMiss()
    },
    submit(e){//修改员工
    },
    chooseDepart(e){//选择部门
      this.empForm["businessEmp.businessEmpDet"]=e;
     
    },
    chooseLevel(e){
      this.empForm["businessEmp.businessEmpLevel"]=e;
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
    importFile: function (e) { // 导入excel
  this.imFile=e.target.files
  let obj = this.imFile
  var f = obj[0];
  var reader = new FileReader()
  let $t = this
  reader.onload = function (e) {
    var data = e.target.result
    if ($t.rABS) {
      $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
        type: 'base64'
      })
    } else {
      $t.wb = XLSX.read(data, {
        type: 'binary'
      })
    }
    let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
    $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
  }
  if (this.rABS) {
    reader.readAsArrayBuffer(f)
  } else {
    reader.readAsBinaryString(f)
  }
},
analyzeData: function (data) {  // 此处可以解析导入数据
  return data
},
dealFile: function (data) {   // 处理导入的数据
  document.getElementById('fileLoad').value=null;
  this.imFile.value=''
  this.excelData = [];
  this.fileShow = false
  if (data.length <= 0) {
    this.errorDialog = true
    this.errorMsg = '请导入正确信息'
  } else {
    this.tableShow=true;
    this.excelData = data
  }
},
upload(){
  var that=this;
  var list=this.excelData;
  var s=0,f=0;
  list.forEach(item=>{
    var body={
       businessEmpCompid:that.userInfo.companyId,
                businessEmpName:item.name,
                businessEmpNum:item.number,
                businessEmpDet:item.depart,
                businessEmpLevel:item.level,
                businessPostion:item.position,
    }
    that.$http.post(that.url.localhost+that.url.addUser,body,{emulateJSON:true}).then(res=>{
        if(res.body.code==200){
          s++;
        }else{
          f++;
        }
        var len=s+f;
        if(len==list.length){
          this.tableShow=false;
          this.$message({
            message:"成功："+s+" ,失败："+f,
            type:"success"
          })
        }
    })
  })
},
downloadFile: function (rs) { // 点击导出按钮
  let data = [{}]
  for (let k in rs[0]) {
    data[0][k] = k
  }
  data = data.concat(rs)
  this.downloadExl(data, '菜单')
},
downloadExl: function (json, downName, type) {  // 导出到excel
  let keyMap = [] // 获取键
  for (let k in json[0]) {
    keyMap.push(k)
  }
  let tmpdata = [] // 用来保存转换好的json
  json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
    v: v[k],
    position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
  }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
    tmpdata[v.position] = {
      v: v.v
    }
  })
  let outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
  let tmpWB = {
    SheetNames: ['mySheet'], // 保存的表标题
    Sheets: {
      'mySheet': Object.assign({},
        tmpdata, // 内容
        {
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
        })
    }
  }
  let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
    {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
  ))], {
    type: ''
  })  // 创建二进制对象写入转换好的字节流
  var href = URL.createObjectURL(tmpDown)  // 创建对象超链接
  this.outFile.download = downName + '.xlsx'  // 下载名称
  this.outFile.href = href  // 绑定a标签
  this.outFile.click()  // 模拟点击实现下载
  setTimeout(function () {  // 延时释放
    URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
  }, 100)
},
s2ab: function (s) { // 字符串转字符流
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
},
getCharCol: function (n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
  let s = ''
  let m = 0
  while (n > 0) {
    m = n % 26 + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
},
fixdata: function (data) {  // 文件流转BinaryString
  var o = ''
  var l = 0
  var w = 10240
  for (; l < data.byteLength / w; ++l) {
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  }
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}
  }
}
</script>
<style scoped>
    .employee{
        width: 100%;
        height: 100%;
    }
.employee .selection{position: relative;width: 10px}
.con_top{padding:0 0.7rem;box-sizing:border-box;width:100%;background: #fff;font-size:0.2rem;color: #333;display: flex;align-items: center;justify-content: flex-start;margin-bottom: 0.2rem; }
.con_top_list{height: 100%;display: flex;align-items: center;justify-content: center;cursor: pointer;padding: .2rem .3rem;box-sizing: border-box;font-size: .2rem;}
.con_top_list_icon{width:.2rem;height: .2rem;margin-right: 0.1rem; }
.con_top_list_icon img{width: .2rem;height: 100%;display: block;}
.rightB{width: 100%;height: 0.56rem;background: #fff;display:flex;justify-content: space-between;align-items: center;font-size: .14rem;color: #333;padding-right: .8rem;box-sizing: border-box;}
.missEmp{width:1.2rem;height: 100%;display:flex;justify-content: center;align-items: center; background: #999;color: #fff;cursor: pointer;}

.personnel,.operation{display: flex;height: 100%;align-items: center;}
.personnel div{margin-right: 0.35rem;}
.filebox{width:80%;height: 8vh;border:1px solid #66b1ff;margin: 0 auto;line-height: 8vh;border-radius: 0.5vh;position: relative;}
#fileLoad{opacity:0;position: absolute;width: 100%;top: 0;left: 0;height: 100%;cursor: pointer;}
</style>
