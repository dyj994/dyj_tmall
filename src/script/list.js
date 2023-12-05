// 获取商品数据进行渲染并分页
const goodsRender = async function () {
    // 从地址栏获取类别信息
    let str = decodeURI(location.search.substring(1))
    let category = ''
    if (str.includes('&')) {
        category = str.split('&').map(item => item.split('=')).filter(item => item[0] === 'category')[0][1]
    } else {
        category = str.split('=')[1]
    }

    $('.allCates').find(`.${category}`).addClass('chosedCate').siblings().removeClass('chosedCate')
    $('.allCates').on('click', 'a', async function () {

        if ($(this).html() === '全部商品') {
            const all = await axios({
                method: 'get',
                url: 'http://localhost:7170/api/goods/list',
                params: {
                    category: '',
                    pagesize: 20
                }
            })
            console.log(all.data);
            render(all.data.data)
            $('.m-style').pagination({
                pageCount: all.data.total,
                jump: true,
                coping: true,
                homePage: '首页',
                endPage: '末页',
                prevContent: '上页',
                nextContent: '下页',
                callback: async function (api) {
                    const all = await axios({
                        method: 'get',
                        url: 'http://localhost:7170/api/goods/list',
                        params: {
                            current: api.getCurrent(),
                            pagesize: 20
                        }
                    })
                    render(all.data.data)
                }
            });

        }
        $(this).addClass('chosedCate').siblings().removeClass('chosedCate')
    })
    const all = await axios({
        method: 'get',
        url: 'http://localhost:7170/api/goods/list',
        params: {
            category,
            pagesize: 20
        }
    })
    console.log(all.data);


    render(all.data.data)
    $('.m-style').pagination({
        pageCount: all.data.total,
        jump: true,
        coping: true,
        homePage: '首页',
        endPage: '末页',
        prevContent: '上页',
        nextContent: '下页',
        callback: async function (api) {
            const all = await axios({
                method: 'get',
                url: 'http://localhost:7170/api/goods/list',
                params: {
                    current: api.getCurrent(),
                    pagesize: 20
                }
            })
            render(all.data.data)
        }
    });

}
goodsRender()
// 渲染类别
const cateRender = async function () {
    const cate = location.search.substring(1).split('=')[1] || ''
    const res = await axios({
        method: 'get',
        url: 'http://localhost:7170/api/goods/category',
    })
    let str = `<p class='allCates'>分类：<a href='javascript:;' class='all chosedCate'>全部商品</a>`
    res.data.list.forEach(element => {
        str += `
        <a href='./list.html?category=${element}' class="${element}">${element}</a>
        `
    });
    str += `</p><p class='sortMethod'>排序：<span class='asc'>价格升序</span> <span class='desc'>价格降序</span></p>`
    $('.category').html(str)
    if (cate === '') {
        $('.all').addClass('chosedCate').siblings().removeClass('chosedCate')
    } else {
        goodsRender()
    }
}
cateRender()
// 渲染数据
function render(data) {
    let str = ''
    data.forEach(item => {
        str += `
        <li>
                    <a href="../views/detail.html?id=${item.goods_id}">
                        <img src="${item.img_big_logo}" alt="">
                        <p class="goods_title">${item.title}</p>
                        <span class="goods_price">￥${item.current_price}</span>
                    </a>
            </li>
        `
    })
    $('.goods ul').html(str)

}

