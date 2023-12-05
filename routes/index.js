const express = require('express')
const fs = require('fs')
const router = express.Router()
// 读取路由文件夹中所有文件遍历引入并使用路由
fs.readdir('./routes', (err, file) => {
    if (err) throw err;
    const fileArr = file.filter(item => item !== 'index.js').map(item => item.slice(0, -3))
    fileArr.forEach(item=>router.use('/'+item, require('./'+item)))
})
// 导出总路由
module.exports = router