const express = require('express')
const path = require('path')
const app = express()
let STUDENTS_ARR = require('./data/students.json')
const fs = require('fs/promises')
const userRouter = require('./routes/students')


//  设置public文件夹为静态资源目录
app.use(express.static(path.resolve(__dirname,'./public')))

//  配置请求体解析
app.use(express.urlencoded({extended:true}))

app.set("view engine",'ejs')    // 配置express的模板引擎为ejs
app.set("views", path.resolve(__dirname, "views"))

//  使路由生效
app.use('/students',userRouter)

app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/students',(req,res)=>{
    res.render('students',{STUS:STUDENTS_ARR})
})

app.post('/students/add',(req,res)=>{
    //  生成一个id
    const id = STUDENTS_ARR.at(-1) ? STUDENTS_ARR.at(-1).id + 1 : 1

    // 获取用户填写的信息
    const newUser = {
        id,
        name:req.body.name,
        age:Number(req.body.age),
        gender:req.body.gender,
        address:req.body.address
    }

    //  将用户信息写入到数组中
    STUDENTS_ARR.push(newUser)

    //  将新的数据写入到json文件中
    fs.writeFile(
        path.resolve(__dirname,'./data/students.json'),
        JSON.stringify(STUDENTS_ARR)
    ).then(()=>{
        console.log('添加成功')
        res.redirect('/students')
    }).catch(()=>{
        console.log('添加失败')
    })
})

app.get('/students/delete',(req,res)=>{
    const id = Number(req.query.id)
    STUDENTS_ARR = STUDENTS_ARR.filter((stu) => stu.id != id)
    fs.writeFile(
        path.resolve(__dirname,'./data/students.json'),
        JSON.stringify(STUDENTS_ARR)
    ).then(()=>{
        console.log('删除成功')
        res.redirect('/students')
    }).catch(()=>{
        console.log('删除失败')
    })
})

app.get('/students/to-update',(req,res)=>{
    const id = Number(req.query.id)
    const student = STUDENTS_ARR.find((stu)=>stu.id === id)
    res.render('update',{student})
})

app.post('/update-student',(req,res)=>{
    const {id,name,age,gender,address} = req.body

    //  根据学生id获取学生对象
    const student = STUDENTS_ARR.find((stu)=>stu.id === Number(id))
    student.name = name
    student.age = Number(age)
    student.gender = gender
    student.address = address


    fs.writeFile(
        path.resolve(__dirname,'./data/students.json'),
        JSON.stringify(STUDENTS_ARR)
    ).then(()=>{
        console.log('修改成功')
        res.redirect('/students')
    }).catch(()=>{
        res.send('修改失败')
    })
})

app.post('/login',(req,res)=>{
    if(req.body.username === 'admin' && req.body.password === '123123'){
        res.redirect('students')
    }else {
        res.send('登陆失败')
    }

    // res.send('登陆成功')
})


//  配置错误路由
app.use((req,res)=>{
    res.redirect('/404.html')
})


app.listen(3000,()=>{
    console.log('Server is running!')
})