const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express()//创建服务
const { port, publicDir } = require('./config')//导入配置的端口
const{ empty,errorHandler } = require('./middleware') //导入全局中间件
app.use(cors())//解决跨域
app.use(bodyParser.urlencoded({ extended: false })); //解析form表单传输的数据
app.use(bodyParser.json()); //解析json格式的数据
app.use('/public',express.static(publicDir))// 加载静态资源


app.use('/api', require('./routes'))// 导入总路由
app.use(empty) //使用全局空路由中间件
app.use(errorHandler); //使用全局错误中间件

app.listen(port, () => console.log(`服务器启动成功！port=${port}`))  ///设置监听的端口