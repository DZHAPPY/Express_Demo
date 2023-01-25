const express = require('express')
let STUDENTS_ARR = require("../data/students.json");
const fs = require("fs/promises");
const path = require("path");
//  创建router对象
const router = express.Router()

//  将router暴露到模块外
module.exports = router

//  权限验证
router.use((req,res,next)=>{
    if(req.session.loginUser){
        next()
    }else {
        res.redirect('/')
    }
})

//  学生列表路由
router.get('/list',(req,res)=>{
    res.render('students',{STUS:STUDENTS_ARR,user:req.session.loginUser})

})

//  添加学生的路由
router.post('/add',(req,res)=>{
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
        path.resolve(__dirname,'../data/students.json'),
        JSON.stringify(STUDENTS_ARR)
    ).then(()=>{
        console.log('添加成功')
        res.redirect('/students/list')
    }).catch(()=>{
        console.log('添加失败')
    })
})

//  删除学生的路由
router.get('/delete',(req,res)=>{
    const id = Number(req.query.id)
    STUDENTS_ARR = STUDENTS_ARR.filter((stu) => stu.id != id)
    fs.writeFile(
        path.resolve(__dirname,'../data/students.json'),
        JSON.stringify(STUDENTS_ARR)
    ).then(()=>{
        console.log('删除成功')
        res.redirect('/students/list')
    }).catch(()=>{
        console.log('删除失败')
    })
})

//  修改学生的路由
router.get('/to-update',(req,res)=>{
    const id = Number(req.query.id)
    const student = STUDENTS_ARR.find((stu)=>stu.id === id)
    res.render('update',{student})
})

router.post('/update-student',(req,res)=>{
    const {id,name,age,gender,address} = req.body

    //  根据学生id获取学生对象
    const student = STUDENTS_ARR.find((stu)=>stu.id === Number(id))
    student.name = name
    student.age = Number(age)
    student.gender = gender
    student.address = address


    fs.writeFile(
        path.resolve(__dirname,'../data/students.json'),
        JSON.stringify(STUDENTS_ARR)
    ).then(()=>{
        console.log('修改成功')
        res.redirect('/students/list')
    }).catch(()=>{
        res.send('修改失败')
    })
})

//  处理存储文件的中间件
// router.use((req,res)=>{
//
// })