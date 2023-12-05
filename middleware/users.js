const { usersModel } = require("../db");

const { checkToken } = require('../uitls/token')
const { flag } = require("../config");

// 验证注册信息
const verifyPasswordRepeat = function (req, res, next) {
  // req.body获取前端传入的数据
  // 对前端传入的数据进行判断
  const { password, rpassword } = req.body;
  // 判断密码和密码重复是否相同
  if (password !== rpassword) return next(5);
  next();
}
// 验证登录信息
const verifyLogin = async function (req, res, next) {
  const { username, password } = req.body;
  // 验证用户名和密码是否匹配
  const info = await usersModel.findOne({ username, password })
  if (!info) return next(4) //登录不通过
  next()
}

// 验证token
const verifyTokenInfo = async function (req, res, next) {
  const token = req.headers.token;
  // token不存在
  if (!token) return next(6);
  const resInfo = await checkToken(token, flag);
  // token匹配不成功
  if (resInfo.code === 0) return next(7);

  // token成功
  // 获取用户id，传入路由再获取用户信息
  req.id = resInfo.info.id;
  next();

}

module.exports = {
  verifyPasswordRepeat,
  verifyLogin,
  verifyTokenInfo
};
