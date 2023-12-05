// 用户修改提交信息
function modifyPassword() {
    layui.use(['form', 'laydate', 'util'], function () {
        var form = layui.form;
        // 提交事件
        $('.modify_btn').on('click', async function (data) {
            const res = await axios({
                method: 'post',
                url: 'http://localhost:7170/api/users/modify',
                data: {
                    oldpassword: $('.oldpassword').val(),
                    password: $('.password').val(),
                    rpassword: $('.rpassword').val()
                },
                headers: {
                    token: localStorage.getItem('authorization'),
                    id: localStorage.getItem('id')
                }
            })

            console.log(res);
            // 密码修改失败时将失败原因弹窗
            if (res.data.code === 0) {
                alert(res.data.msg)
            } else {
                // 密码修改成功跳转登录页，需要重新登录
                alert('密码修改成功')
                location.href = './login.html'
                localStorage.removeItem('id')
                localStorage.removeItem('authorization') 
            }
            return false; // 阻止默认 form 跳转
        });
    });
}
modifyPassword()