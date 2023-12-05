const express = require('express')
const $ = require('jquery')
const router = express.Router()
// 导入用户控制器函数
const { registryHandler, loginHandler, infoHandler, editHandler, modifyPWDHandler } = require('../controller/users')
// 导入用户相关中间件
const {verifyPasswordRepeat, verifyTokenInfo} = require('../middleware/users')
router.post('/login', loginHandler)
router.get('/info',verifyTokenInfo, infoHandler)
router.post('/registry', verifyPasswordRepeat, registryHandler)
router.post('/edit', verifyTokenInfo, editHandler)
router.post('/modify', verifyPasswordRepeat, modifyPWDHandler)

module.exports = router