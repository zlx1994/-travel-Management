<template>
         <div class="employeeList standards" >
                <el-table v-loading="load"  stripe :data="standards" style="width: 100%">
                  <el-table-column  prop="businessLevel.businessLevelName"  :formatter="levelType"  label="级别"  width="180">
                  </el-table-column>
                  <el-table-column prop=""  :formatter="travelType" label="交通工具" width="180">
                
                  </el-table-column>
                  <el-table-column  prop="address" :formatter="hotelType" label="酒店">
                  </el-table-column>
                  <el-table-column  prop="address" :formatter="standardType" label="每天标准">
                  </el-table-column>
                  <el-table-column  prop="address" label="操作">
                      <template slot-scope="scope">
                        <el-button @click="changeStandards(scope.row)" style="border:0;"><img src="../assets/bianji.png" alt=""></el-button>
                      </template>  
                  </el-table-column>
                </el-table>
                <el-dialog title="修改类别" :visible.sync="changeType">  
                    <el-form class="changeType" type="flex" :label-position="labelPosition"  :model="formTypes">
                        <el-form-item label="交通工具：" label-width="150px">
                            <el-checkbox-group v-model="formTypes.travel" >
                                <el-checkbox v-for="item in types.travel" :label="item.businessName" :value="item.businessId" :key="item.businessId"></el-checkbox>
                            </el-checkbox-group>
                            <!-- <el-select  v-model="formTypes.travelType" placeholder="formTypes.travelType">
                                <option ></option>
                            </el-select> -->
                        </el-form-item>
                        <el-form-item label="酒店类型：" label-width="150px">
                            <el-select v-model="formTypes.hotel">
                                <!-- :value="item.businessModel+' '+item.businessModelSize " -->
                                <el-option  v-for="(item,index) in types.hotel" :value="item.businessModel+' '+item.businessModelSize" :label="item.businessModel+' '+item.businessModelSize " :key='item.businessId'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="standardsType" label="消费标准：" label-width="150px">
                                <el-input placeholder="请输入最低额度" v-model="formTypes.standard[0]"></el-input> ——
                                <el-input placeholder="请输入最高额度" v-model="formTypes.standard[1]"></el-input>
                            
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="changeType = false">取 消</el-button>
                        <el-button type="primary" @click="updateType">确 定</el-button>
                    </div>
                </el-dialog>

            </div>   
</template>
<script>
import store from '../vuex/store.js'
export default {
    data(){
        return {
            rightShow:'',
            url:store.state.api,
            companyId:store.state.userInfo.companyId,
            standards:[],
            changeType:false,
            labelPosition:'right',
            formTypes:{
                travel:[],
                hotel:'',
                standard:[],
            },
            types:{},
            load:true,
        }
    },
    created(){

    },
    props:['ind'],
    watch:{
        ind(val,oldval){
            if(val==23){
                this.getStandards();
                this.getWay()
            }
        }
    },
    methods:{
        getStandards(){
           var body={
            companyId:this.companyId,
         }
         this.$http.post(this.url.localhost+this.url.getStandards,body,{emulateJSON:true}).then(res=>{
             if(res.body!=""&&res.body.code==200)
                this.load=false;
                var data=res.body.data;
                console.log(res.body)
                var list=data.list;
                // list.forEach((item,index)=>{
                    
                // })
                this.standards=data;

                this.employeeListVisible=false
                this.setIngVisible=false;
                this.employeeStramVisible=true;
                this.stramEmpVisible=false;
            }, (err) => {
                console.log(err)
            }) 
        },
        getWay(){//获取交通方式和酒店标准
             var body={
            companyId:this.companyId,
         }
         this.$http.post(this.url.localhost+this.url.way,body,{emulateJSON:true}).then(res=>{
             console.log(res.body)
             if(res.body!=""&&res.body.code==200)
                this.loadTable=false;
                var data=res.body.data;
                console.log(res.body)
                var list=data.list;
            
                 var travel=[],hotel=[];
                list.forEach((item,index)=>{
                    if(item.businessType==0){
                        
                        travel.push(item)
                    }else if(item.businessType==1){
                        var str=item.businessModel+" "+item.businessModelSize;
                        hotel.push(item)
                    }
                })
                this.types.travel=travel;
                this.types.hotel=hotel;

                this.employeeListVisible=false
            this.setIngVisible=false;
            this.employeeStramVisible=true;
            this.stramEmpVisible=false;
            }, (err) => {
                console.log(err)
            }) 
        },
        levelType(row, column, cellValue, index){
           
            return row.businessLevel.businessLevelNum+"级/ "+row.businessLevel.businessLevelName
        },
        travelType(row, column, cellValue, index){
            //  console.log(row,column,cellValue)
             var list=row.businessMethodList;
             var arr=[];
             list.forEach((item,index)=>{
                 arr.push(item.businessName)
             })
             console.log(arr)
             return arr.join(',')
        },
        hotelType(row, column, cellValue, index){
            console.log(row)
            return row.standardHotel+"/每天"
        },
        standardType(row, column, cellValue, index){
            var str1=row.standardMoney.split('-')
            return "最低"+str1[0]+"(元)——最高"+str1[1]+"(元)"
        },
        changeStandards(data){//修改交通工具和酒店 标准
            console.log(data)
            this.changeType=true;
            this.formTypes.travel=[];
            data.businessMethodList.forEach((item,index)=>{
                this.formTypes.travel.push(item.businessName)
            })
            this.formTypes.hotel=data.standardHotel;
            var str=data.standardMoney.split('-');
            this.formTypes.standard.push(str[0],str[1])
            this.formTypes.id=data.standardId;
            console.log(this.formTypes)
        },
        updateType(){//修改内容
            console.log(this.formTypes);
            if(this.formTypes.standard[0]>this.formTypes.standard[1]){
                this.$message({
                    message:'最高金额不能小于最低金额！',
                    type:"warning"
                })
                return false;
            }
            var arr=[]
           this.types.travel.forEach((item,index)=>{
               this.formTypes.travel.forEach((items,index)=>{
                   if(item.businessName==items){
                   arr.push(item.businessId)
               }
               })
               
           })
        //    console.log(arr)
            var body={
                    standardId:this.formTypes.id,
                    method:arr.join(','),
                    hotelStandard:this.formTypes.hotel,
                    moneyStandard:this.formTypes.standard.join('-')
            }
            console.log(body)
             this.$http.post(this.url.localhost+this.url.updateStandards,body,{emulateJSON:true}).then(res=>{
             if(res.body.code==200)
                this.loadTable=false;
                // var data=res.body.data;
                console.log(res.body)
                this.$message({
                    message:"修改成功！",
                    type:"success"
                })
                this.getStandards();
                this.changeType=false;
            }, (err) => {
                console.log(err)
            }) 
        }
    },
}
</script>
<style scoped>

</style>
