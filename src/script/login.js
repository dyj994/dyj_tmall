!function () {

    layui.use(['form', 'laydate', 'util'], function () {
        var form = layui.form;
        // 提交事件
        form.on('submit(demo1)', function (data) {
            var field = data.field; // 获取表单字段值
            console.log(field);
            axios({
                method: 'post',
                url: 'http://localhost:7170/api/users/login',
                data: field
            }).then(result => {
                console.log('login:' + result);
                if (result.data.code === 1) {
                    localStorage.setItem('id', result.data.id)
                    localStorage.setItem('authorization', result.data.token)
                    location.href = '../views/index.html'
                } else if(result.data.code === 0) {
                    alert(result.data.msg)
                    $('.log_register').show()
                    $('.admin').hide()
                }
            })
            return false; // 阻止默认 form 跳转
        });
    });


}()