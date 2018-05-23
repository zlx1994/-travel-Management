import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state={
    api:{
        localhost:'http://192.168.1.8:8181/',
        queryKey:"business/emp/queryKey",
        add:'business/steam/add',//添加审核流
        list:'business/emp/list',//获取所有员工
        allList:'business/steam/Alllist',//获取所有审批流
        steamList:'business/steam/list',//获取审批流编号下员工
        delete:'business/steam/delete',//删除审批流员工
        emp:'business/steam/queryEmp',//获取未加入审批流员工
        approverMe:'business/steam/approverMe',//设置审核人 是否自己审批
        pisserm:'business/steam/pisserm',//审核权限
        addUser:"business/emp/add",//添加员工
        updateEmp:'business/emp/update',//修改员工
        deleteUser:"business/emp/delete",//删除员工
        deleteAll:'business/emp/deleteALL',//多选删除员工
        queryDet:"business/company/getAllDepart",//添加获取部门
        queryLv:"business/company/getAllLevel",//获取级别 
        addDepart:'business/company/addDepart',//添加部门 String departName,Integer companyId
        delDepart:'business/company/deleteDepart',//删除部门 Integer departId
        updateDepart:'business/company/updateDepart',//修改部门名称 String departName,Integer departId
        getDepart:'business/company/getDepart',//分页获取部门 Integer companyId Integer  pageNum  Integer  pageSize
        getAllDepart:'business/company/getAllDepart',//获取所有部门 Integer companyId
        addLevel:'business/company/addLevel',//添加级别 Integer levelNum,String levelName,Integer companyId
        delLevel:"business/company/deleteLevel",//删除级别 Integer levelId,Integer companyId  删除级别，级别1 2 3 删除 2 自动变为 1 2  级别人数不为0允许删除
        updateLevel:"business/company/updateLevel",//修改级别名称 Integer levelId,String levelName
        getLevel:"business/company/getLevel",//分页获取级别  Integer companyId,@RequestParam(defaultValue = "1") Integer pageNum,@RequestParam(defaultValue = "10")Integer pageSize
        maxLevel:"business/company/getMaxLevel",//获取最大级别
        getStandards:'business/company/getStandard',//获取差旅标准
        updateStandards:'business/company/updateStandard',//修改差旅标准 Integer standardId,String method,String hotelStandard,String moneyStandard
        way:"business/order/way",//获取差旅交通方式和入驻标准
        login:'business/company/companyLogin',//String user,String password
    },
   
    // 用户信息
    userInfo:{
        companyId:2,
        loginState:false,
    }

}
export default new Vuex.Store({
    state
})