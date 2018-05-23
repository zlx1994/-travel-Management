<template>
    <div class="login">
        <canvas id="canvasParticle" width="100vw" height="100vh"></canvas>
        <el-form class="form" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <el-form-item label="用户名">
                <el-input class="input" v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input class="input" type="password" v-model="formLabelAlign.pass"></el-input>
            </el-form-item>
            <el-form-item>
                <div style="width:100%;display:flex;justify-content:center;">
                    <el-button class="gv" @click="sign">登陆</el-button>
                </div>
               
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import store from '../vuex/store.js'
export default {
    data(){
        return {
            labelPosition:'right',
            formLabelAlign:{
                name:'',
                pass:"",
            },
            state:true,
        }
    },
    props:['login'],
    mounted(){
        if(this.state){
            this.can()
        }
    },
    methods:{
        sign(){
            console.log(this.formLabelAlign)
            var url=store.state.api;
            var body={
                user:this.formLabelAlign.name,
                password:this.formLabelAlign.pass
            }
            this.$http.post(url.localhost+url.login,body,{emulateJSON:true}).then(res=>{
                console.log(res.body)
                if(res.body.code==200){
                    store.state.userInfo.companyId=res.body.data;
                    store.state.userInfo.loginState=true;
                   
                    var info={
                        user:this.formLabelAlign.name,
                        password:this.formLabelAlign.pass,
                        loginState:true
                    }
                     localStorage.setItem('key',JSON.stringify(info));
                    this.$router.push({path:'/'})
                }else{
                    this.$message({
                        message:res.body.message,
                        type:'error'
                    })
                }
            })
        },
        can(){
            var oCanvas = document.getElementById('canvasParticle');
    var cxt = null;
    var particles = {};
    var particleIndex = 0;

    if (oCanvas.getContext) {
        cxt = oCanvas.getContext('2d');
    }

    oCanvas.width = window.innerWidth;
    oCanvas.height = window.innerHeight;

    function Particle() {
        particleIndex++;
        particles[particleIndex] = this;

        this.x = oCanvas.width / 2;
        this.y = oCanvas.height / 2;
        this.vx = Math.random() * 6 - 3;
        this.vy = Math.random() * 4 - 2;
        this.growth = (Math.abs(this.vx) + Math.abs(this.vy)) * 0.01; // 根据x/y轴的位置决定大小
        this.id = particleIndex;
        this.size = 0;
        this.color = getRandomColor();
    };

    Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += this.growth;

        if (this.x < 0 || this.x > oCanvas.width || this.y < 0 || this.y > oCanvas.height) {
            delete particles[this.id];
        }

        cxt.fillStyle = this.color;
        cxt.beginPath();
        cxt.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        cxt.fill();
    };

    function animate() {
        requestAnimationFrame(animate);

        cxt.fillStyle = '#222222';
        cxt.fillRect(0, 0, oCanvas.width, oCanvas.height);

        new Particle();

        for (var i in particles) {
            particles[i].draw();
        }
    };
    requestAnimationFrame(animate);


function getRandomColor() {
    return '#' + (Math.random() * 0xffffff << 0).toString(16);
};
        }
    },
    
}
</script>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
#canvasParticle{
    width: 100vw;
    position: absolute;
    left: 0%;
    top: 0;
    z-index: -1;
}
.form{
    width: 30%;
    height: 50vh;
    margin: 30vh auto;
    color: #fff;
}
.gv{
	text-decoration: none;
    background: url('../assets/nav_gv.png') repeat 0px 0px;
    width: 130px;
    height: 43px;
    display: block;
    text-align: center;
    cursor: pointer;
    float: left;
    margin: 10px 2px 10px 2px;
    color: #066197;
}
.gv:hover { 
	background: url('../assets/nav_gv.png') repeat 0px -43px; 
	color:#1d7eb8;
	-webkit-box-shadow: 0 0 6px #1d7eb8;
	transition-duration: 0.5s;
}
</style>
