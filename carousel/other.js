function saveOtherData() {
    const otherData = {
        isOtherAgreedContent: document.getElementById('Radio_AgreedContent_YES').checked,
        otherAgreedContent: document.getElementById('Radio_AgreedContent_content').value,
        isOtherCourtAgreed: document.getElementById('Radio_AgreedContent_NO').checked
    };

    const summary = updateSummary();

    otherData.otherSummary = summary;

    // 儲存到localStorage
    localStorage.setItem('other', JSON.stringify(otherData));
    console.log(otherData);

    $('#summary_Area').css('visibility', 'visible');
}

function updateSummary() {
    // 從localStorage取得資料
    const otherData = {
        isOtherAgreedContent: document.getElementById('Radio_AgreedContent_YES').checked,
        otherAgreedContent: document.getElementById('Radio_AgreedContent_content').value,
        isOtherCourtAgreed: document.getElementById('Radio_AgreedContent_NO').checked,
    };

    let summary = '';

    if (otherData.isOtherAgreedContent) {
        summary += '雙方共同約定協議內容如下 :';
    }

    if (otherData.otherAgreedContent) {
        summary += otherData.otherAgreedContent + '。';
    }

    if (otherData.isOtherCourtAgreed) {
        summary += ' 不約定。';
    }

    $('#All_Summary').html(summary);

    return summary;
}

$(document).ready(function () {
    // 從localStorage載入資料
    const parentsData = JSON.parse(localStorage.getItem('Parents')) || {};
    const otherData = JSON.parse(localStorage.getItem('other')) || {};

    // 代入甲乙方
    if (parentsData.A) {
        document.querySelector('.A').textContent = parentsData.A;
    }

    if (parentsData.titleA) {
        document.querySelector('.titleA').textContent = parentsData.titleA;
    }

    if (parentsData.B) {
        document.querySelector('.B').textContent = parentsData.B;
    }

    if (parentsData.titleB) {
        document.querySelector('.titleB').textContent = parentsData.titleB;
    }

    // 顯示小結語
    if (otherData.otherSummary) {
        $('#All_Summary').html(otherData.otherSummary);
        $('#summary_Area').css('visibility', 'visible');
    }

    // 恢復之前的選項和內容
    if (otherData.isOtherAgreedContent) {
        $('#Radio_AgreedContent_YES').prop('checked', true);
    }

    if (otherData.isOtherCourtAgreed) {
        $('#Radio_AgreedContent_NO').prop('checked', true);
    }

    if (otherData.otherAgreedContent) {
        $('#Radio_AgreedContent_content').val(otherData.otherAgreedContent);
    }

    // 選"已經約定後"清空約定內容
    $('#Radio_AgreedContent_NO').change(function () {
        if (this.checked) {  
            $('#Radio_AgreedContent_content').val('');
            $('#Radio_AgreedContent_YES').prop('checked', false);
        }
    });

    $('#Radio_AgreedContent_YES').change(function () {
        if (this.checked) {
            $('#Radio_AgreedContent_NO').prop('checked', false);
        }
    });

    // 儲存時動作
    $('#saveButton').click(function () {
        saveOtherData();
    });
});
