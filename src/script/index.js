// 轮播图
carousel()
function carousel() {
    var swiper1 = new Swiper('.first_swiper', {
        loop: true, // 循环模式选项
        autoplay: true,
        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })
    var swiper2 = new Swiper('.second_swiper', {
        loop: true, // 循环模式选项
        autoplay: true,
        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })

}

// 商品分类列表渲染
renderCategory()
async function renderCategory() {
    await axios({
        method: 'get',
        url: 'http://localhost:7170/api/goods/category',
    }).then(res => {
        let result = res.data.list
        let cateStr = result.reduce((prev, next) => {
            return prev += `
            <a href='./list.html?category=${next}' class='cate_list'><i class='iconfont'></i><span>${next}<span></a>
            `
        }, '')
        $('.category').html(cateStr)
        const iconList = ['icon-remen', 'icon-icon-bar', 'icon-jiayongdianqi', 'icon-tongzhuang', 'icon-erhuan', 'icon-zhinengshebei', 'icon-yanjing', 'icon-xingliyishisunhuai', 'icon-wodejiepai', 'icon-diannao', 'icon-chuweidianqi', 'icon-wine', 'icon-qiyelxrsz', 'icon-xiyiyee', 'icon-zhengtijiazhuang', 'icon-naifen', 'icon-nanzhuang', 'icon-nvzhuangqunzi-']
        $('.cate_list i').each((index, item) => {
            item.classList.add(iconList[index])
        })
    })
}

// 猜你喜欢商品渲染
guessLikeRender()
async function guessLikeRender() {
    await axios({
        method: 'get',
        url: 'http://localhost:7170/api/goods/list',
        params: {
            category: '热门推荐',
            pagesize: 30
        }
    }).then(res => {
        const list = res.data.data
        let goodsStr = ''
        list.forEach(item => {
            goodsStr += `
            <li>
                    <a href="./detail.html?id=${item.goods_id}">
                        <img src="${item.img_big_logo}" alt="">
                        <p class="goods_title">${item.title}</p>
                        <span class="goods_price">￥${item.current_price}</span>
                    </a>
            </li>
            `
        })
        $('.like_data').html(goodsStr)

    })
}


// 判断用户登陆状态
loginState()
async function loginState() {
    const id = localStorage.getItem('id')
    const token = localStorage.getItem('authorization')
    // 用户没有登录
    if (!id || !token) {
        $('log_registry').show()
        $('.admin').hide()
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
        return
    }

    // 登录成功
    $('.log_register').hide()
    $('.admin').show()
    $('.admin a.namespan').html(`Hi, ${res.data.info.username}`)
    $('.login_entrance a p span').html(`${res.data.info.username}`)
    console.log(res.data);
    $('.login_entrance a img').attr('src', `http://localhost:7170/${res.data.info.avatar}`)
    $('a.exit').on('click', function () {
        localStorage.removeItem('id')
        localStorage.removeItem('authorization')
        location.reload(true); //刷新
    })
}

