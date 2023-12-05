function renderStructure(data, list) {
    let str = ''
    list.forEach((element, index) => {
        str += `
        <div class="goods" data-goodsid="${data[index].goodsId}" data-userid="${data[index].userId}">
            <div class="le">
                <input type="checkbox" name="" class="singleChecked" checked>
            <img src="${element.img_big_logo}" alt="">
            <p class="title">${element.title}</div>
            <div class="ri">
                <span class="price">￥${element.price}</span>
                <p class="amount">
                    <span class="minus">-</span>
                    <input type="text" value="${data[index].goodsNum}" class="num_inp">
                    <span class="plus">+</span>
                </p>
                <span class="cost">￥${(parseFloat(element.price) * parseInt(data[index].goodsNum)).toFixed(2)}</span>
                <span class="delete">删除</span>
            </div> 
        </div>
        `
    });
    $('.wrapper').html(str)
    calculatorAll()

}
async function getData() {
    const userId = localStorage.getItem('id')
    const resInfo = await axios({
        method: 'post',
        url: 'http://localhost:7170/api/cart/info',
        data: {
            userId
        },
        headers: {
            token: localStorage.getItem('authorization')
        }
    })

    console.log(resInfo.data);

    renderStructure(resInfo.data.data, resInfo.data.list)
}
getData()

// 全选和反选
function allChecked() {
    // 全选状态影响其余复选框
    $('.all_inp input').on('click', function () {
        $('.singleChecked').prop('checked', $(this).prop('checked'))
        calculatorAll()
    })

    // 其他复选框影响全选
    $('.wrapper').on('click', '.singleChecked', function () {
        let len1 = $('.wrapper').find('.singleChecked').length
        let len2 = $('.wrapper').find('.singleChecked:checked').length
        if (len1 === len2) {
            $('.all_inp input').prop('checked', true)
        } else {
            $('.all_inp input').prop('checked', false)
        }
        calculatorAll()
    })
}
allChecked()

//统计计算
function calculatorAll() {
    let sum = 0
    let total = $('.wrapper .goods').length
    $('.cart_num').html(total)
    $('.wrapper .goods').each((index, item) => {
        if ($(item).find('.singleChecked').prop('checked')) {
            sum += parseFloat($(item).find('.cost').html().substring(1))
        }
    })
    // 控制结算按钮
    $('.total_price').html('￥' + sum.toFixed(2))
    if ($('.total_price').html() === '￥0.00') {
        $('.btn_pay').addClass('disabled')   
    } else {
        $('.btn_pay').removeClass('disabled')   
    }
}


// 商品数量加减
function changeAmount() {
    // 商品数量加1
    $('.wrapper').on('click', '.plus', async function () {
        $(this).prev().val((parseInt($(this).prev().val()) + 1))
        $(this).parents('.ri').find('.cost').html('￥' +
            (parseFloat($(this).parents('.ri').find('.price').html().substring(1)) * parseInt($(this).prev().val())).toFixed(2)
        )
        calculatorAll()
        // 获取商品的id和更改后的数量传给后端，实时更新数据库
        updater($(this).parents('.goods').attr('data-userid'),$(this).parents('.goods').attr('data-goodsid'), $(this).parents('.amount').find('input').val())
    })
    // 直接在文本框中输入商品数量,控制用户输入
    $('.wrapper').on('input', '.num_inp',async function () {
        if (!/^\d+$/.test($(this).val())) {
            $(this).val(1)
        }
    })
    // 输入框失去焦点时提交修改
    $('.wrapper').on('blur', '.num_inp', async function () { 
        updater($(this).parents('.goods').attr('data-userid'),$(this).parents('.goods').attr('data-goodsid'), $(this).val())
    })


    // 商品数量减1
    $('.wrapper').on('click', '.minus', async function () {
        // 控制商品最少为1件
        if ($(this).next().val() <= 1) {
            $(this).next().val(1)
            $(this).parents('.ri').find('.cost').html('￥' +
                (parseFloat($(this).parents('.ri').find('.price').html().substring(1)) * parseInt($(this).next().val())).toFixed(2)
            )
            // 获取商品的id和更改后的数量传给后端，实时更新数据库
            calculatorAll()
            updater($(this).parents('.goods').attr('data-userid'),$(this).parents('.goods').attr('data-goodsid'), $(this).parents('.amount').find('input').val())
        } else {
            $(this).next().val((parseInt($(this).next().val()) - 1))
            $(this).parents('.ri').find('.cost').html('￥' +
                (parseFloat($(this).parents('.ri').find('.price').html().substring(1)) * parseInt($(this).next().val())).toFixed(2)
            )
            calculatorAll()
            // 获取商品的id和更改后的数量传给后端，实时更新数据库
            console.log($(this).parents('.goods').attr('data-userid'),$(this).parents('.goods').attr('data-goodsid'));
            updater($(this).parents('.goods').attr('data-userid'),$(this).parents('.goods').attr('data-goodsid'), $(this).parents('.amount').find('input').val())
        }
    })
    // 删除一条商品
    $('.wrapper').on('click', '.delete', async function () {
        if (confirm(`确认要删除这件商品嘛？`)) {
            $(this).parents('.goods').remove()
            calculatorAll()
            // 将用户id和商品id传递给后端，让后端删除该用户的该条商品数据
            console.log($(this).parents('.goods').attr('data-goodsid'));
            deleter($(this).parents('.goods').attr('data-userid'),$(this).parents('.goods').attr('data-goodsid'))
        }
    })
    // 删除多条商品
    $('.all_inp button').on('click', function () {
        if (confirm('确认要删除选中的商品嘛？')) {
            $('.wrapper .goods').each((index, item) => {
                if ($(item).find('.singleChecked').prop('checked')) {
                    $(item).remove()//前端删除
                    calculatorAll()
                    // 将用户id和商品id传递给后端，让后端删除该用户的该条商品数据
                    deleter($(item).attr('data-userid'),$(item).attr('data-goodsid')) //数据库删除
                }
            })
        }
    })
}
changeAmount()

// 更新商品
async function updater(userId, goodsId, goodsNum) {
    await axios({
        method: 'post',
        url: 'http://localhost:7170/api/cart/update',
        data: {
            userId,
            goodsId,
            goodsNum
        },
        headers: {
            token: localStorage.getItem('authorization')
        }
    })
}

// 删除商品
async function deleter(userId, goodsId) {
    await axios({
        method: 'post',
        url: 'http://localhost:7170/api/cart/delete',
        data: {
            goodsId,
            userId
        },
        headers: {
            token: localStorage.getItem('authorization')
        }
    })
}