// 配置路由中间件(请求的路由地址不存在)
function empty(req, res, next) {
  res.status(404).send({
    code: 0,
    msg: "你请求的接口不存在，或者接口地址有误",
  });
  next();
}

// 全局错误路由中间件
// err接收next里面的值
function errorhandler(err, req, res, next) {
  const info = { code: 0 };
  if (err === 5) {
    info.msg = "密码和密码重复不一致";
  }
  res.send(info);
}

module.exports = {
  empty,
  errorhandler,
};
