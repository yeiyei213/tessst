function savePropertyData() {
    const propertyData = {
        isAgreedContent: document.getElementById('Radio_AgreedContent_YES').checked,
        agreedContent: document.getElementById('Radio_AgreedContent_content').value,
        isCourtAgreed: document.getElementById('Radio_AgreedContent_NO').checked,
        waiveRights: document.getElementById('Check_WaiveRights').checked
    };

    const summary = updateSummary();

    propertyData.propertySummary = summary;

    // 儲存到localStorage
    localStorage.setItem('property', JSON.stringify(propertyData));
    console.log(propertyData);

    $('#summary_Area').css('visibility', 'visible');
}

function updateSummary() {
    // 從localStorage取得資料
    const propertyData = {
        isAgreedContent: document.getElementById('Radio_AgreedContent_YES').checked,
        agreedContent: document.getElementById('Radio_AgreedContent_content').value,
        isCourtAgreed: document.getElementById('Radio_AgreedContent_NO').checked,
        waiveRights: document.getElementById('Check_WaiveRights').checked
    };

    let summary = '夫妻財產剩餘分配方式 :<br>';

    if (propertyData.isAgreedContent) {
        summary += '雙方共同約定夫妻財產方式內容如下 :';
    }

    if (propertyData.agreedContent) {
        summary += propertyData.agreedContent + '。';
    }

    if (propertyData.isCourtAgreed) {
        summary += ' 雙方已經由法院約定共同財產制，不於此討論。';
    }

    if (propertyData.waiveRights) {
        summary += ' 雙方同意於離婚時，相互放棄民法第1030-1條剩餘財產分配請求之權利。';
    }

    $('#All_Summary').html(summary);

    return summary;
}

$(document).ready(function () {
    // 從localStorage載入資料
    const parentsData = JSON.parse(localStorage.getItem('Parents')) || {};
    const propertyData = JSON.parse(localStorage.getItem('property')) || {};

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
    if (propertyData.propertySummary) {
        $('#All_Summary').html(propertyData.propertySummary);
        $('#summary_Area').css('visibility', 'visible');
    }

    // 恢復之前的選項和內容
    if (propertyData.isAgreedContent) {
        $('#Radio_AgreedContent_YES').prop('checked', true);
    }

    if (propertyData.isCourtAgreed) {
        $('#Radio_AgreedContent_NO').prop('checked', true);
    }

    if (propertyData.agreedContent) {
        $('#Radio_AgreedContent_content').val(propertyData.agreedContent);
    }

    if (propertyData.waiveRights) {
        $('#Check_WaiveRights').prop('checked', true);
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
        savePropertyData();
    });
});
