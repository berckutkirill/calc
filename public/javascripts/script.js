$(".ajaxForm").on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url:$(this).attr('action'),
        data: $(this).serialize(),
        method:'post',
        success:function (res) {
            console.log(res);
        }
    })
});