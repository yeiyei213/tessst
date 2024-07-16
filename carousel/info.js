let parentsData = {};
let childrenData = [];

// function checkAndAddNextButton() {
//     let nextButton = `<button class="next" onclick="window.location='project.html'">接續填寫</button>`;
//     if (Object.keys(parentsData).length !== 0 && childrenData.length !== 0) {
//         $('.confirm').remove();
//         if ($('.next').length === 0) {
//             $(nextButton).appendTo('.button-container');
//         }
//     }
// }

// 初始化時載入 localStorage 中的資料
$(document).ready(function () {
    loadLocalStorage();

    // 點擊新增時
    $('#button').click(function () {
        var toAdd = $('input[name=ListItem]').val();
        if (toAdd.trim() !== '') {
            $('ol').append('<li>' + toAdd + '<i class="far fa-trash-alt delete" id="delete-button"></i></li>');
            $('input[name=ListItem]').val('');  // 清空輸入框
            //saveToLocalStorage();
        } else {
            alert("請輸入子女姓名");
        }
    });

    // 按下 enter 鍵也可以新增
    // $("input[name=ListItem]").keyup(function (event) {
    //     if (event.keyCode == 13) {
    //         $("#button").click();
    //     }
    // });

    // 刪除
    $(document).on('click', '#delete-button', function () {
        $(this).parent().remove();
        //saveToLocalStorage();
    });

    // 排序
    $('ol').sortable({
        stop: function (event, ui) {
            //saveToLocalStorage();
        }
    });

    $('.confirm').click(function() {
        saveToLocalStorage();
    });
});

function saveToLocalStorage() {
    // 儲存 Parents 資料
    parentsData = {
        "A": $('input[name=A]').val(),
        "titleA": $('input[name=titleA]').val(),
        "B": $('input[name=B]').val(),
        "titleB": $('input[name=titleB]').val(),
    };

    // 儲存 Children 資料
    childrenData = [];
    $('ol li').each(function () {
        childrenData.push($(this).text().trim());
    });

    // 檢查是否有子女
    if (childrenData.length === 0) {
        alert("本網站服務僅限有子女者使用，請新增子女。");
        return;  // 中止操作
    }

    // 儲存到 localStorage
    localStorage.setItem('Parents', JSON.stringify(parentsData));
    console.log('Saved Parents:', parentsData);

    localStorage.setItem('Children', JSON.stringify(childrenData));
    console.log('Saved Children:', childrenData);

    // 跳轉到指定頁面
    window.location.href = 'index.html';
}

function loadLocalStorage() {
    // 載入 Parents 資料
    parentsData = JSON.parse(localStorage.getItem('Parents')) || {};
    if (parentsData) {
        $('input[name=A]').val(parentsData.A || '');
        $('input[name=titleA]').val(parentsData.titleA || '');
        $('input[name=B]').val(parentsData.B || '');
        $('input[name=titleB]').val(parentsData.titleB || '');
    }
    console.log('Loaded Parents:', parentsData);

    // 載入 Children 資料
    childrenData = JSON.parse(localStorage.getItem('Children')) || [];
    if (childrenData) {
        childrenData.forEach(function (item) {
            $('#ol_list').append('<li>' + item + '<i class="far fa-trash-alt delete" id="delete-button"></i></li>');
        });
    }
    console.log('Loaded Children:', childrenData);

    //checkAndAddNextButton();
}

function cleanstring() {
    var r = confirm("確定要清除基本資料嗎？");
    if (r == true) {
        // 清空所有的輸入框
        $('input').val('');

        // 清空未成年子女的列表
        $('#ol_list').empty();

        // 清空指定的 localStorage 條目
        localStorage.removeItem('Parents');
        localStorage.removeItem('Children');
        console.log('Cleared Parents and Children from localStorage');

        // 重置 parentsData 和 childrenData
        parentsData = {};
        childrenData = [];

        
    }
}