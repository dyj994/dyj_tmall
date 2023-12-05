// 获取用户信息渲染页面内容
async function getUserInfo() {
    const res = await axios({
        method: 'get',
        url: 'http://localhost:7170/api/users/info',
        headers: {
            token: localStorage.getItem('authorization'),
            id: localStorage.getItem('id')
        }
    })
    console.log(res.data);
    // 获取用户信息成功，渲染页面
    if (res.data.code === 1) {
        $("input[name='username']").val(res.data.info.username)
        $("input[name='nickname']").val(res.data.info.nickname)
        $("input[name='age']").val(res.data.info.age)
        $('img#avatar').attr('src', 'http://localhost:7170/' + res.data.info.avatar)
        $("select[name='gender']").val(res.data.info.gender)
        layui.form.render("select"); //重新渲染select，layui的规定
    }

}
getUserInfo()

function previewImg() {
    $('#avatarInp').on('change', function () {
        // this.files用来获取用户上传的文件信息，返回值为长度为1的数组
        const file = this.files[0]
        // 判断用户上传的文件类型，如果不是图片，删除表单的name值，依靠name值上传图片数据
        if (!/^image/.test(file.type)) {
            $(this).name = ''
            return
        }
        // 用户正确上传图片后，读取文件信息
        const fr = new FileReader()
        fr.readAsDataURL(file),
            fr.onload = function () {
                // 图片加载完成后，将base64编码格式的图片赋值给当前的图片对象
                $('img#avatar').attr('src', fr.result)
                $('#avatarInp').attr('name', 'avatar')
            }
    })
}
previewImg()

// 用户修改提交信息
function modifyInfo() {
    $('.modify_btn').on('click', async function () {
        const res = await axios.post('http://localhost:7170/api/users/edit', {
            nickname: $('.nickname').val(),
            age: $('.age').val(),
            gender: $('.gender').val(),
            avatar: $('#avatarInp').val()
        }, {
            headers: {
                token: localStorage.getItem('authorization'),
                id: localStorage.getItem('id'),
            }
        })
        if (res.data.code === 1) {
            alert('个人信息修改成功')
            location.reload()
        }
        if (res.data.code === 0) {
            alert(res.data.msg)
        }
    })

}
modifyInfo()