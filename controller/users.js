// jquery模块的完整导入
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
// 导入创建和校验token的函数
const { createToken } = require('../uitls/token')
// 导入配置项中的flag和过期时间
const { flag, expires } = require('../config')
// 导入用户数据库
const { usersModel } = require('../db')

const loginHandler = async function (req, res) {
    const { username, password } = req.body
    const userinfo = await usersModel.find({ username, password })
    if (userinfo.length === 0) {
        // 登录用户信息匹配失败
        res.send({
            code: 0,
            msg: '用户名或密码错误，请重新输入'
        })
        return
    } else {
        const id = userinfo[0]._id
        // 登录信息匹配成功，生成token
        const token = createToken({ id }, flag, expires)
        res.send({
            code: 1,
            msg: '登录成功',
            token,
            id
        })
        return
    }
}
const registryHandler = async function (req, res) {
    const { username, password, rpassword, nickname, gender, age } = req.body
    const info = await usersModel.findOne({ username })
    if (info) {
        res.send({
            code: 0,
            msg: '用户名已存在，请更换用户名'
        })
        return
    }

    new usersModel({
        username,
        password,
        rpassword,
        nickname,
        gender,
        age,
        avatar: `${gender === '女' ? '../public/avatar/women.webp' : gender === '男' ? '../public/avatar/man.webp' : '../public/avatar/default.jpg'}`
    }).save().then(result => {
        res.send({
            code: 1,
            msg: '注册成功'
        })
    })
}

const infoHandler = async function (req, res) {
    const { id } = req.headers
    const resInfo = await usersModel.findById(id); //通过id获取用户的所有信息
    if (resInfo.length === 0) {
        res.send({
            code: 0,
            msg: "获取用户信息失败，请检查",
        });
        return;
    }

    // 获取成功
    res.send({
        code: 1,
        msg: "获取用户信息成功",
        info: {
            username: resInfo.username,
            nickname: resInfo.nickname,
            avatar: resInfo.avatar,
            id: resInfo._id,
            gender: resInfo.gender,
            age: resInfo.age,
        },
    });
}
const editHandler = async function (req, res) {
    const { id } = req.headers
    const { nickname, gender, age } = req.body
    console.log(req.body);
    // 获取图片路径
    console.log(nickname, gender);
    let avatar = req.file ? req.file.path : "";
    const originUrl = await usersModel.find({ _id: id })
    console.log(avatar, age, originUrl);
    if (!avatar) {
        avatar = originUrl.avatar;
    }
    // 组装用户提交的修改数据
    const info = {
        nickname, gender, age, avatar
    }
    console.log(info);
    await usersModel.updateOne({ _id: id }, info).then(res => console.log('更新用户信息成功'))
    res.send({
        code: 1,
        msg: '信息更新成功'
    })
}

const modifyPWDHandler = async function (req, res) {
    const { id } = req.headers
    const { oldpassword, password, rpassword } = req.body
    console.log(id, oldpassword, password, rpassword);
    if (!id) {
        res.send({
            code: 0,
            msg: '用户id不存在，请检查'
        })
        return
    }
    const resInfo = await usersModel.find({ _id: id, password: oldpassword })
    console.log(resInfo);
    if (resInfo.length === 0) {
        res.send({
            code: 0,
            msg: '原密码不正确，请重新输入'
        })
        return
    }

    await usersModel.updateOne({ _id: id, password: oldpassword }, { password, rpassword })
    res.send({
        code: 1,
        msg: '密码修改成功'
    })
}

module.exports = { registryHandler, loginHandler, infoHandler, editHandler, modifyPWDHandler }