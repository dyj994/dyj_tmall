!function () { 
    layui.use(['form', 'laydate', 'util'], function(){
        var form = layui.form;        
        // 提交事件
        form.on('submit(demo1)', function(data){
          var field = data.field; // 获取表单字段值
            $.ajax({
                method: 'post',
                url: 'http://localhost:7170/api/users/registry',
                data: field
            }).then(result => {
                if (result.code === 1) {
                   location.href = '../views/login.html' 
                }
                if (result.code === 0) {
                    alert(result.msg)
                }
                
            })
          return false; // 阻止默认 form 跳转
        });
      });
}()