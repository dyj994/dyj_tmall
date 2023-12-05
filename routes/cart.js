const express = require('express')
const router = express.Router()
const { verifyTokenInfo } = require('../middleware/users')
const { addHandler, infoHandler, updateHandler, deleteHandler } = require('../controller/carts')
router.post('/add', verifyTokenInfo, addHandler)
router.post('/info', verifyTokenInfo, infoHandler)
router.post('/update', verifyTokenInfo, updateHandler)
router.post('/delete', verifyTokenInfo, deleteHandler)



module.exports = router