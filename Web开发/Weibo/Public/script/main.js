/**
 * Created by zhy on 16/6/16.
 */
$(function () {
    $("a.upload > img").click(function () {
        $("input.upload").trigger("click");
    });

    $("img.input").click(function () {
        $("input.input").trigger("click");
    });
    
    $("input#button3").click(function () {
        var frename = $(this).siblings('a').html();
        
        $.post('../../', {
            action: 'focus',
            tran: frename
        })
    });
});