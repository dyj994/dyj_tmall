// jquery模块的完整导入
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
// 导入商品数据库
const { goodsModel } = require('../db');

async function listHandler(req, res) {
    let { pagesize, current, category } = req.query
    pagesize = pagesize || 12
    current = current || 1
    category = category || ''
    console.log(category);
    if (!category) {
        const all = await goodsModel.find({})
        const resultInfo = await goodsModel
            .find()
            .skip((current - 1) * pagesize) //0     10
            .limit(pagesize);
        res.send({
            code: 1,
            msg: '获取商品列表成功',
            data: resultInfo,
            total: Math.ceil(all.length / pagesize)
        })
    } else {
        const all = await goodsModel.find({ category })
        const cateInfo = await goodsModel
            .find({ category })
            .skip((current - 1) * pagesize) //0     10
            .limit(pagesize);
        res.send({
            code: 1,
            msg: '获取商品类别成功',
            data: cateInfo,
            total: Math.ceil(all.length / pagesize)
        })
    }

}

async function cateHandler(req, res) {
    let { pagesize, current, category } = req.query
    pagesize = pagesize || 12
    current = current || 1
    category = category || ''
    console.log(category);
    if (category === '') {
        let cateArr = []
        const allCateInfo = await goodsModel
            .find({})
        allCateInfo.forEach(item => cateArr.push(item.category))

        const allGoodsInfo = await goodsModel
            .find({})
            .skip((current - 1) * pagesize) //0     10
            .limit(pagesize);
        res.send({
            code: 1,
            msg: '获取所有商品类别成功',
            list: [... new Set(cateArr)],
            data: allGoodsInfo
        })
        return
    }

    const all = await goodsModel.find({ category })
    const cateGoods = await goodsModel
        .find({ category })
        .skip((current - 1) * pagesize) //0     10
        .limit(pagesize);
    res.send({
        code: 1,
        msg: `获取${category}类商品成功`,
        pageCount: Math.ceil(cateGoods.length / pagesize),
        data: cateGoods,
        total: Math.ceil(all.length / pagesize)
    })
}


const detailHandler = async function (req, res) {
    const { id } = req.query
    const info = await goodsModel.find({ goods_id: id })
    res.send({
        code: 1,
        msg: '成功获取商品详情',
        data: info[0]
    })
}
const searchHandler = async function (req, res) {
    const title = req.query
    const resInfo = await goodsModel.find({ title: { $regex: new RegExp('^'+title.title) } })
    res.send({
        code: 1,
        msg: '匹配结果如下',
        data: resInfo
    })
}


module.exports = {
    listHandler,
    cateHandler,
    detailHandler,
    searchHandler
}