// 渲染函数
function renderHTML(data) {
    $('.magnify img').attr('src', data.img_big_logo)
    $('.smallPic li img').attr('src', data.img_big_logo)
    $('.glass img').attr('src', data.img_big_logo)
    $('.detail_info .title').html(data.title)
    $('.detail_info .price').html('￥' + data.price)
    $('.goods_related').html(data.goods_introduce)
    $('.num_control input').val(1)
}
// 获取对应id的商品信息
async function getGoods() {
    const id = location.search.substring(1).split('=')[1]
    const res = await axios({
        url: 'http://localhost:7170/api/goods/detail',
        params: {
            id,
        }
    })
    renderHTML(res.data.data)
}
getGoods()

// 放大镜
function magnify() {
    $('.magnify').on('mouseover', function (e) {
        $('.mask').show()
        $('.glass').show()
    })

    $('.magnify').on('mousemove', function (e) {
        let left = e.pageX - $('.magnify').offset().left - 100
        let top = e.pageY - $('.magnify').offset().top - 100
        left = left <= 0 ? 0 : left >= 200 ? 200 : left
        top = top <= 0 ? 0 : top >= 200 ? 200 : top
        $('.mask').css('left', left)
        $('.mask').css('top', top)
        $('.glass img').css('left', -left * 2)
        $('.glass img').css('top', -top * 2)
    })

    $('.magnify').on('mouseout', function () {
        $('.mask').hide()
        $('.glass').hide()
    })

    // 鼠标移入下方图片列表切换上方及放大镜图片数据，并为当前li标签添加active类名显示边框
    $('.smallPic').on('mouseover', 'li', function () {
        $('.magnify img').attr('src', $(this).find('img').attr('src'))
        $('.glass img').attr('src', $(this).find('img').attr('src'))
        $(this).addClass('active').siblings().removeClass('active')
    })
}
magnify()


// 加入购物车
function addToCart() {
    // 商品数量加
    $('.plus').on('click', function () {
        $('.num_control input').val(function () {
            console.log(this);
            console.log(this.value);
            return this.value = parseInt(this.value) + 1
        })
    })
    // 商品数量减
    $('.minus').on('click', function () {
        $('.num_control input').val(function () {
            if (this.value <= 1) return this.value = 1
            return this.value = parseInt(this.value) - 1
        })
    })
    $('.addToCart').on('click', async function () {
        const goodsId = location.search.substring(1).split('=')[1]
        const userId = localStorage.getItem('id')
        const res = await axios({
            method: 'post',
            url: 'http://localhost:7170/api/cart/add',
            data: {
                goodsId,
                userId,
                goodsNum: $('.num_control input').val()
            },
            headers: {
                token: localStorage.getItem('authorization')
            }
        })
        console.log(res.data);
        if (res.data.code === 0) {
            alert(res.data.msg)
            location.href = './login.html'
        } else {
            if (confirm('加入购物车成功，是否跳转到购物车页面？')) {
                location.href = './shopping.html'
            } 
        }
    })

    // 直接输入数量时控制用户输入，以防输入非数字或0开头的数字
    $('.num_inp').on('input', function () {
        if (!/^\d+$/.test($(this).val())) {
            $(this).val(1)
        }
    })

}

addToCart()