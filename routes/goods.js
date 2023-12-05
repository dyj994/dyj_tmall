const express = require('express')
const router = express.Router()

const { listHandler, cateHandler, detailHandler, searchHandler } = require('../controller/goods')
router.get('/list', listHandler)
router.get('/category', cateHandler)
router.get('/detail', detailHandler)
router.get('/search', searchHandler)


module.exports = router