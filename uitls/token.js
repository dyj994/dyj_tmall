// 利用jsonwebtoken第三方工具生成和效验token
const jwt = require("jsonwebtoken");
// 1.生成token

// 参数：
// info用户信息
// flag特殊的标记(很多时候都是利用软件随机生成)
// expires过期时间，以秒为单位

function createToken(info, flag, expires) {
  return jwt.sign(info, flag, {
    expiresIn: expires,
  });
}

// 验证token
function checkToken(token, flag) {
  return new Promise((resolve) => {
    jwt.verify(token, flag, (err, info) => {
      if (err) {
        //匹配失败
        resolve({ code: 0, message: err.message });
      } else {
        //匹配成功
        resolve({ code: 1, info });
      }
    });
  });
}

module.exports = {
  createToken,
  checkToken,
};
