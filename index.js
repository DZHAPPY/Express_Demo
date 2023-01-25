const express = require('express')
const path = require('path')
const app = express()
let STUDENTS_ARR = require('./data/students.json')
const fs = require('fs/promises')
const userRouter = require('./routes/students')
const session = require('express-session')
const cookieParser = require('cookie-parser')
//  引入session-file-store
const Filestore = require('session-file-store')(session)
//  引入uuid
const uuid = require('uuid').v4

//  设置session中间件
app.use(session({
    store:new Filestore({
        //  path用来指定session本地文件的路径
        path:path.resolve(__dirname,'./sessions'),
        //  加密
        secret:'hello',
        //  session的有效时间(秒)
        ttl: 3600,
        //  默认情况下，filestore每隔一小时会清除一次session对象
        reapInterval: 3600
    }),
    secret:'hello'
}))

//  设置public文件夹为静态资源目录
app.use(express.static(path.resolve(__dirname,'./public')))

//  配置请求体解析
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set("view engine",'ejs')    // 配置express的模板引擎为ejs
app.set("views", path.resolve(__dirname, "views"))

//  使路由生效
app.use('/students',userRouter)

app.get('/',(req,res)=>{
    const token = uuid()
    console.log(uuid)
    res.render('login')
})

app.post('/login',(req,res)=>{
    const {username,password} = req.body
    if(username === 'admin' && password === '123123'){
        //  登录成功后将用户信息放入session (这里只是将loginUser放入内存的session中)
        req.session.loginUser = username
        //  手动调用save使session立即存储
        req.session.save(()=>{
            res.redirect('students/list')
        })
    }else {
        res.send('登陆失败')
    }

    // res.send('登陆成功')
})

app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })

})



//  配置错误路由
app.use((req,res)=>{
    res.redirect('/404.html')
})


app.listen(3000,()=>{
    console.log('Server is running!')
})