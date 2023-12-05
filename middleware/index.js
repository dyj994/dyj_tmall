function empty(req, res, next) {
    res.status(404).send({
        code: 0,
        msg: "你请求的接口不存在，或者接口地址有误",
      });
      next();
}
function errorHandler(err,req, res, next) {
    const info = { code: 0 };
    if (err === 5) {
      info.msg = "密码和密码重复不一致";
    }
    if (err === 4) {
        info.msg = "用户名或密码错误，请重新输入";
    }
    if (err === 6) {
      info.msg = "token不存在，请传入token";
    }
    if (err === 7) {
        info.msg = "token匹配失败，请检查登录信息或重新登录";
    }
    res.send(info);
}
module.exports = {
    empty,
    errorHandler
}