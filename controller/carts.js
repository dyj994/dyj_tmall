const { goodsModel, cartsModel } = require('../db')
async function addHandler(req, res) {
    const { goodsId, userId, goodsNum } = req.body

    let resInfo = await cartsModel.find({ userId, goodsId })
    if (resInfo.length >= 1) {
        await cartsModel.updateOne({ userId, goodsId }, { goodsNum: parseInt(resInfo[0].goodsNum) + parseInt(goodsNum) })
    } else {
        resInfo = new cartsModel({ goodsId, userId, goodsNum }).save().then(res => console.log(goodsId, userId, goodsNum))
    }

    res.send({
        code: 1,
        msg: '加入购物车成功',
        list: resInfo
    })
}

async function infoHandler(req, res) {
    const { userId } = req.body
    const resInfo = await cartsModel.find({ userId })
    const arrId = []
    resInfo.forEach(item => arrId.push(item.goodsId))
    const list = await goodsModel.find({ goods_id: { $in: arrId } })
    res.send({
        code: 1,
        msg: '获取用户购物车信息成功',
        data: resInfo,
        list
    })
}
async function updateHandler(req, res) {
    const { goodsId, goodsNum } = req.body
    await cartsModel.updateOne({ goodsId }, { goodsNum }).then(res=>console.log('更新成功')).catch(err=>console.log(err))
}
async function deleteHandler(req, res) {
    const { goodsId, userId } = req.body
    console.log(goodsId);
    await cartsModel.deleteOne({ goodsId, userId }).then(res => console.log('删除成功')).catch(err => console.log(err))
}


module.exports = {
    addHandler,
    infoHandler,
    updateHandler,
    deleteHandler
}