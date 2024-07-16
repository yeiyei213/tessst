let s = location.protocol + '//' + location.hostname;
let file = 'infosecurity.dat';
let init_func = 'function2';
let a = "";
var tokenAjax = function (type = 'post', url, data = null) {
    $.ajax({
        type: type,
        url: s + `/servlet/jform?file=${file}&em_step=0&init_func=${init_func}&buttonid=button4`,
        data: data,
        success: function (res) {
            a = res.data;
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
};

//寄信按鈕
var sendAjax = function (type = 'post', url, requestData) {
    $.ajax({
        type: type,
        url: url,
        data: requestData,
        success: function (res) {
            console.log("存入資料庫成功");
        },
        error: function (xhr) {
            console.log("存入資料庫失敗rrr" + xhr);
        }
    });
};


tokenAjax();
$("#register").click(async function () {
    const email = $('.email').val();
    let requestData = {
        email: email,
    };
    let url = s + `/servlet/jform?file=${file}&em_step=0&init_func=${init_func}&buttonid=button5`;
    sendAjax('get', url, requestData);
    alert("已寄出！記得檢查信箱確認~");
});