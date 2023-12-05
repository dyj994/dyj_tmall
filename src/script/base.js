$('.right .myTmall').hover(
    function () {
        $('.myGoods').show()
    },
    function () {
        $('.myGoods').hide()
    }
)
$('.right .myCollection').hover(
    function () {
        $('.collection').show()
    },
    function () {
        $('.collection').hide()
    }
)
$('.right .merchant_support').hover(
    function () {
        $('.right .merchant_support .merchant').css('visibility', 'visible')
    },
    function () {
        $('.right .merchant_support .merchant').css('visibility', 'hidden')
    }
)
$('.right .contact_service').hover(
    function () {
        $('.right .contact_service .service').css('visibility', 'visible')
    },
    function () {
        $('.right .contact_service .service').css('visibility', 'hidden')
    }
)

// 判断用户登录状态（前端的登录鉴权）
loginState()
async function loginState() {
    const id = localStorage.getItem('id')
    const token = localStorage.getItem('authorization')
    // 用户没有登录
    if (!id || !token) {
        $('log_registry').show()
        $('.admin').hide()
        $('.nav_cart a').on('click', function () {
            alert('请先登录')
            location.href = '../views/login.html'
        })
        $('.myTmall a.mine').on('click', function () {
            alert('请先登录')
            location.href = '../views/login.html'
        })
        return
    }
    const res = await axios({
        method: 'get',
        url: 'http://localhost:7170/api/users/info',
        headers: {
            token,
            id
        }
    })
    // 用户的的登陆信息不正确
    if (res.data.code === 0) {
        $('log_registry').show()
        $('.admin').hide()
        $('.nav_cart a').on('click', function () {
            alert('请先登录')
            location.href = '../views/login.html'
        })
        $('.myTmall a.mine').on('click', function () {
            alert('请先登录')
            location.href = '../views/login.html'
        })
        return
    }

    // 登录成功
    $('.log_register').hide()
    $('.admin').show()
    $('.admin a.namespan').html(`Hi, ${res.data.info.username}`)
    $('.login_entrance a p span').html(`${res.data.info.username}`)
    $('.nav_cart a').on('click', function () {
        location.href = '../views/shopping.html'
    })
    $('.myTmall a.mine').on('click', function () {
        location.href = '../views/userinfo.html'
    })
    $('a.exit').on('click', function () {
        localStorage.removeItem('id')
        localStorage.removeItem('authorization')
        location.reload(true); //刷新
    })

    return res.data.data
}
search()
function search() {
    $('.search_inp').on('input', async function () {
        $('.related').show()
        const title = $(this).val()
        console.log(title);
        const resList = await axios({
            url: 'http://localhost:7170/api/goods/search',
            params: {
                title
            }
        })
        if ($(this).val() === '') {
            $('related').hide()
        }
        const arr = resList.data.data
        if (arr.length >= 1) {
            $('.related').show()
            let str = ''
            arr.forEach(ele => {
                str += `
                <li data-id="${ele.goods_id}" class="item">${ele.title}</li>
                `
            });
            $('.related').html(str)
        } else {
            $('.related').hide()
        }
    })

}
