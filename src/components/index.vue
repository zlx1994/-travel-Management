<template>
  <div class="con">
      <div class="left">
        <div class="logoBox">
          <div class="logo"><img src="../assets/logo.png" alt=""></div>
          <div class="title">佳阳科技差旅管理</div>
        </div>
        <div class="menu">
          <!-- :style="ind==index?'menuStyle':''"  -->
          <div v-for="(item,index) in menu" @click='tabChange($event,index)' :id='index' :style="ind==index?menuStyle:''" class="menuList" >
            <!-- <div > -->
              <div class="menuList_icon"><img class="menuListIcon" :src="item.logo" alt="">{{item.title}}</div>
              <div><img :src="item.jt" alt=""></div>
            <!-- </div> -->
          </div>
        </div>
      </div>
   
      <div class="right" :style='rightStyle'>
          <div class="content">
            <div class="con_top">
              <div class="con_top_list" v-for='(item,index) in rightNav' :style='navIndex==index?navStyle:""' @click="choosePower($event,index,item.img)">
                <div class="con_top_list_icon"><img :src="item.img" alt=""></div>
                <div>{{item.title}}</div>
              </div>
            </div>
            <div class="employeeList">
              <el-table class="employee" :data="employee" style="width: 100%;background:#666;color:#fff;">
                <el-table-column prop="name" label="姓名" >  </el-table-column>
                <el-table-column prop="number" label="编号"> </el-table-column>
                <el-table-column prop="department" label="部门"> </el-table-column>
                <el-table-column prop="level" label="级别"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"><img src="../assets/bianji.png" alt=""></el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small"><img src="../assets/shanchu.png" alt=""></el-button>
                  </template>
                </el-table-column>
                <el-table-column type='selection' class="selection" placeholder="全选" prop="address" width='100' label="全选">
                  <el-checkbox v-model="checked"><img src="../assets/weixuanzhong.png" alt=""></el-checkbox>
                </el-table-column>
              </el-table>
            </div>
            <div class="rightB">
              <div class="missEmp">遗漏员工</div>
              <div class="pagemsg">
                <div class="personnel">
                  <div class="approvalPerson">审批人：人</div>
                  <div class="allEmployee">全部员工：人</div>
                  <div class="pageNum">共页</div>
                </div>
                <div class="operation">
                  <div class="block">
                    <!-- <span class="demonstration">直接前往</span> -->
                    <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :small='small' :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="100">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      menu:[{logo:require('../assets/liebiao.png'),title:'员工列表',jt:require('../assets/jiantou.png')},{logo:require('../assets/guanli.png'),title:'差旅管理',jt:require('../assets/jiantou.png')},{logo:require('../assets/shezhi.png'),title:'设置',jt:require('../assets/jiantou.png')}],
      menuStyle:'background:#16508d;',
      rightNav:[{img:require('../assets/sousuo.png'),title:'快速查找'},{img:require('../assets/tianjia.png'),title:'添加员工'},{img:require('../assets/daoru.png'),title:'员工导入'},{img:require('../assets/daochu.png'),title:'员工导出'}],
      defaultImg:[require('../assets/sousuo.png'),require('../assets/tianjia.png'),require('../assets/daoru.png'),require('../assets/daochu.png')],
      changeImg:[require('../assets/sousuobai.png'),require('../assets/tianjiab.png'),require('../assets/daorub.png'),require('../assets/daochub.png')],
      ind:'0',
      navStyle:'',
      navIndex:'',
      employee:[{'name':'张三','number':'010-001','department':'技术部','level':'5'}],
      checked:false,
      currentPage:1,
      small:true,//分页显示大小
    }
  },
  mounted:function(){
    var that=this;
    
  },
  methods:{
    tabChange:function(e,i){
      e=e||event;
      this.ind=i
      this.menuStyle='background:#16508d;'
      // e.target.style='background:#16508d;'
      console.log(this.ind)
      console.log(this.menuStyle)
    },
    choosePower:function(a,b,c){
      var navStyle='background:#3d7bbe;color:#fff;'
      this.navStyle=navStyle;
      this.navIndex=b;
      var that=this;
      console.log(c)
      console.log(this.rightNav[b].img)
      var list=this.rightNav;
      list.forEach(function(item,index){
        if(b==index){
          console.log(that.rightNav)
          console.log('选中当前',b,index)
          that.rightNav[b].img=that.changeImg[b]
        }else{
          console.log('排他',b,index)
          that.rightNav[index].img=that.defaultImg[index]
        }
      })
    },
    //page changed
    handleSizeChange:function(){

    },
    handleCurrentChange:function(){

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.con{width: 100%;height: 100%;background: #f1f1f1;display: flex;justify-content: space-between;}
.left{width: 16.35%;height: 100%;background: linear-gradient(0deg,#71b7f2 0%, #2267b4 100%);}
.logoBox{padding: 0.9rem 0;box-sizing: border-box;display: flex;flex-direction: column;justify-content: center;align-items: center;}
.logo{width: 1.33rem;height: 1.33rem;margin-bottom: 0.2rem;}
.logo img{width: 100%;height: 100%;}
.title{font-size: 0.2rem;color: #ffffff;}
.menu{width: 100%;}
.menuList{height:0.8rem;padding: 0 0.23rem 0 0.55rem;box-sizing: border-box;display: flex;justify-content: space-between;align-items: center;font-size: 0.16rem;color: #fff;border-bottom: 1px solid#e8f3ff;}
.menuList_icon{height: 100%;display: flex;align-items: center;}
.menuListIcon{width: 0.3rem;height: .3rem;margin-right: 0.11rem;}
.menuStyle{background:#16508d;}
.right{width: 83.65%;height:100%;position: relative;}
.content{width: 100%;height: 100%;}
.con_top{padding:0 0.7rem;box-sizing:border-box;height: 0.8rem;width:100%;background: #fff;font-size:0.2rem;color: #333;display: flex;align-items: center;justify-content: flex-start;margin-bottom: 0.2rem; }
.con_top_list{width: 1.86rem;height: 100%;display: flex;align-items: center;justify-content: center;}
.con_top_list_icon{width:0.3rem;height: 0.3rem;margin-right: 0.1rem; }
.con_top_list_icon img{width: 100%;height: 100%;display: block;}
/*员工列表样式*/
.employee{width: 100%;}
.employee .selection{position: relative;}
.rightB{width: 100%;height: 0.56rem;background: #fff;position:absolute;bottom:0;display:flex;justify-content: space-between;align-items: center;font-size: .14rem;color: #333;padding-right: .8rem;box-sizing: border-box;}
.missEmp{width:1.2rem;height: 100%;line-height: 0.56rem; background: #999;color: #fff;}
.pagemsg{display: flex;height: 100%;justify-content: space-between;}
.personnel{display: flex;height: 100%;align-items: center;}
.personnel div{margin-right: 0.35rem;}


</style>
