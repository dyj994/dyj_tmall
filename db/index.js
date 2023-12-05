// 利用mongoose创建，设计，连接等操作
// 1.引入模块
const mongoose = require("mongoose");

// 2.连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/tmall_project");
// jquery模块的完整导入
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);


// 3.创建商品集合里面的字段(key)
const goodsTable = new mongoose.Schema(
  {
    //注意：默认提供一个唯一的id(主键)字段
    goods_id: {
      type: Number, //设置类型
      required: true, //是否必填
    },
    title: {
      type: String,
      required: true,
    },
    img_big_logo: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    current_price: {
      type: Number,
      required: true,
    },
    goods_number: {
      type: Number,
      required: true,
    },
    is_sale: {
      type: Boolean,
      required: true,
    },
    sale_type: {
      type: String,
      required: true,
    },
    is_hot: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    goods_introduce: {
      type: String,
      required: true,
    }

  },
  { versionKey: false } //去掉默认生成的_v
);
// 3.创建商品集合里面的字段(key)
const usersTable = new mongoose.Schema(
  {
    //注意：默认提供一个唯一的id(主键)字段
    username: {
      type: String, //设置类型
      required: true, //是否必填
    },
    password: {
      type: String,
      required: true,
    },
    rpassword: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['保密', '男', '女'],
    },
    age: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    }
  },
  { versionKey: false }
);
const cartTable = new mongoose.Schema(
  {
    //注意：默认提供一个唯一的id(主键)字段
    userId: {
      type: String, //设置类型
      required: true, //是否必填
    },
    goodsId: {
      type: String,
      required: true,
    },
    goodsNum: {
      type: String,
      required: true,
    },
 },
  { versionKey: false }
 
);
const goodsModel = mongoose.model("goods", goodsTable);
const usersModel = mongoose.model("users", usersTable);
const cartsModel = mongoose.model("carts", cartTable);

// 获取server中的数据存入本地数据库
// const arr = []
// arr.forEach(element => {
//   new goodsModel(element)
//     .save() //返回promise
//     .then((res) => console.log(1)) //打印你插入的数据
//     .catch((err) => console.log(err));
// });



module.exports = { goodsModel, usersModel, cartsModel }
