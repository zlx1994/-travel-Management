import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state={
    localhost:'http://192.168.1.6:8181/',
    add:'business/steam/add',//添加审核流
    allList:'business/steam/Alllist',//获取所有审批流
    list:'business/steam/list',//获取审批流编号 员工
    delete:'business/steam/delete',//删除员工
    emp:'business/steam/queryEmp',//获取未加入审批流员工
}
export default new Vuex.Store({
    state
})