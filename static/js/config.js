var status;
$('.save-btn').click(function () {
    if (status == 'true') {
        alert('请先关闭服务重试！'); 
        return false
    }
    var data = {
        mosID: $('#mosID').val(),
        mosPlugInID: $('#mosPlugInID').val(),
        mosItemBrowserProgID: $('#mosItemBrowserProgID').val(),
        mosItemEditorProgID: $('#mosItemEditorProgID').val()
    }
    $.ajax({
        url: '/setConfig',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.success === 1) {
                alert('保存成功！');
            }
        },
        error: function (err) {
    
        },
        complete: function () {}
    })
})

$('.status-btn span').click(function () {
    $.ajax({
        url: '/changeStatus',
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            status = data.data.status;
            if (data.data.status) {
                $('.status').html('已开启') 
                $('.status-btn span').html('关闭服务')
            } else {
                $('.status').html('已关闭') 
                $('.status-btn span').html('开启服务') 
            }
        },
        error: function (err) {
    
        },
        complete: function () {}
    })
})

// 获取服务status
$.ajax({
    url: '/getStatus',
    type: 'get',
    data: '',
    dataType: 'json',
    success: function (data) {
        status = data;
        if(data) {
           $('.status').html('已开启') 
           $('.status-btn span').html('关闭服务')
        } else {
            $('.status').html('已关闭') 
            $('.status-btn span').html('开启服务')
        }
    },
    error: function (err) {

    },
    complete: function () {}
})