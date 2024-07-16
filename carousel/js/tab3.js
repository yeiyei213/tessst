let previousRadio = null;

function toggleFields(radio) {
    if (previousRadio === radio) {
        // 取消radio選中狀態
        radio.checked = false;
        previousRadio = null;
        // radio恢復預設狀態
        document.querySelectorAll('input[name="Radio_paymentMethod"]').forEach(function (elem) {
            elem.disabled = false;
        });


        document.getElementById('one-time-payment-fields').style.display = 'none';
        document.getElementById('installment-payment-fields').style.display = 'none';
        document.getElementById('staged-payment-fields').style.display = 'none';
    } else {
        // 禁用其他radio
        document.querySelectorAll('input[name="Radio_paymentMethod"]').forEach(function (elem) {
            elem.disabled = true;
        });

        // 啟用被點擊的radio
        radio.disabled = false;

        document.getElementById('one-time-payment-fields').style.display = 'none';
        document.getElementById('installment-payment-fields').style.display = 'none';
        document.getElementById('staged-payment-fields').style.display = 'none';

        // 顯示選中的radio接續欄位
        if (radio.id === 'Radio_paymentMethod1') {
            document.getElementById('one-time-payment-fields').style.display = 'block';
        } else if (radio.id === 'Radio_paymentMethod2') {
            document.getElementById('installment-payment-fields').style.display = 'block';
        } else if (radio.id === 'Radio_paymentMethod3') {
            document.getElementById('staged-payment-fields').style.display = 'block';
        }

        previousRadio = radio;
    }
}

function saveData3() {
    // 初始化變數
    let All_Alimony = [];
    let Alimony = {};
    let Options = {};

    // 獲取選擇的子女
    var radioButtons = document.getElementsByName('radio_children');
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            Alimony['Child'] = radioButtons[i].dataset.childName;
            break;
        }
    }

    if (!Alimony.Child) {
        alert("請選擇子女！");
        return;
    }

    // 獲取支付方式的相關資訊
    document.querySelectorAll('#tab3 input[type="radio"]').forEach(function (radioButton) {
        var info = {
            'Result': radioButton.checked,
            'Text': radioButton.nextElementSibling.textContent.trim()
        };
        Alimony[radioButton.id] = info;
    });

    // 檢查支付方式的選擇
    if (!Alimony.Radio_WhoPay.Result && !Alimony.Radio_WhoPay1.Result) {
        alert("請選擇雙方由誰給付！");
        return;
    }
    if (!Alimony.Radio_paymentMethod1.Result && !Alimony.Radio_paymentMethod2.Result && !Alimony.Radio_paymentMethod3.Result) {
        alert("請選擇支付方式！");
        return;
    }

    // 檢查一次給付
    var paymentDate1 = document.getElementById('paymentDate1').value;
    var payment1 = document.getElementById('payment1').value;
    if (Alimony.Radio_paymentMethod1.Result) {
        if (!paymentDate1 || !payment1) {
            alert('請填寫給付日期或給付費用!');
            return;
        }
        Alimony['PaymentDate1'] = paymentDate1;
        Alimony['Payment1'] = payment1;
    }

    // 檢查分期給付
    var paymentDate2 = document.getElementById('paymentDate2').value;
    var payment2 = document.getElementById('payment2').value;
    if (Alimony.Radio_paymentMethod2.Result) {
        if (!paymentDate2 || !payment2) {
            alert('請填寫給付日期或給付費用!');
            return;
        }
        Alimony['PaymentDate2'] = paymentDate2;
        Alimony['Payment2'] = payment2;
    }

    // 檢查分階段給付
    var paymentMethod3_text1 = document.getElementById('paymentMethod3_text1').value;
    var paymentMethod3_text2 = document.getElementById('paymentMethod3_text2').value;
    var paymentMethod3_text3 = document.getElementById('paymentMethod3_text3').value;
    var paymentDate3Value = document.getElementById('paymentDate3').value;
    if (Alimony.Radio_paymentMethod3.Result) {
        if (!paymentMethod3_text1 && !paymentMethod3_text2 && !paymentMethod3_text3) {
            alert('請填寫階段給付內容!');
            return;
        }
        if (!paymentDate3Value) {
            alert('請填寫給付日期!');
            return;
        }
        Alimony['PaymentMethod3Text1'] = paymentMethod3_text1;
        Alimony['PaymentMethod3Text2'] = paymentMethod3_text2;
        Alimony['PaymentMethod3Text3'] = paymentMethod3_text3;
        Alimony['PaymentDate3'] = paymentDate3Value;
    }

    // 檢查給付形式
    if (!Alimony.Radio_pay.Result && !Alimony.Radio_pay1.Result) {
        alert('請選擇給付形式!');
        return;
    }
    var paymentWay = document.getElementById('paymentWay').value;
    if (Alimony.Radio_pay1.Result && !paymentWay) {
        alert('請填寫其他給付形式!');
        return;
    }
    if (Alimony.Radio_pay1.Result) {
        Alimony['PaymentWay'] = paymentWay;
    }

    // 收集複選框選項
    document.querySelectorAll('#tab3 input[type="checkbox"]').forEach(function (checkbox) {
        var op = {
            'Result': checkbox.checked,
            'Text': checkbox.nextElementSibling.textContent.trim()
        };
        if (checkbox.nextElementSibling.textContent.trim() == '其他') {
            op['Text'] = document.getElementById('OtherText').value;
        }
        Options[checkbox.id] = op;
    });
    Alimony['Options'] = Options;

    // 檢查並更新 localStorage 中的數據
    var existingData = JSON.parse(localStorage.getItem("Alimony")) || [];
    const indexToRemove = existingData.findIndex(item => item.Child === Alimony.Child);
    if (indexToRemove !== -1) {
        existingData.splice(indexToRemove, 1);
    }
    existingData.push(Alimony);
    localStorage.setItem('Alimony', JSON.stringify(existingData));

    // 更新摘要和圖示
    loadChildDataIcon();
}


// function loadSavedData() {
//     var existingData = JSON.parse(localStorage.getItem("Alimony")) || [];
//     existingData.forEach(function (data) {
//         document.querySelectorAll('input[name="radio_children"]').forEach(function (radio) {
//             if (radio.dataset.childName === data.Child) {
//                 radio.checked = true;

//                 document.getElementById('payment-method-section').style.display = 'block';

//                 document.querySelectorAll('#tab3 input[type="radio"]').forEach(function (radioButton) {
//                     if (data[radioButton.id] && data[radioButton.id].Result) {
//                         radioButton.checked = true;
//                         toggleFields(radioButton);
//                     }
//                 });

//                 if (data.PaymentDate1) {
//                     document.getElementById('paymentDate1').value = data.PaymentDate1;
//                     document.getElementById('one-time-payment-fields').style.display = 'block';
//                 }
//                 if (data.Payment1) document.getElementById('payment1').value = data.Payment1;
//                 if (data.PaymentDate2) {
//                     document.getElementById('paymentDate2').value = data.PaymentDate2;
//                     document.getElementById('installment-payment-fields').style.display = 'block';
//                 }
//                 if (data.Payment2) document.getElementById('payment2').value = data.Payment2;
//                 if (data.PaymentMethod3Text1) {
//                     document.getElementById('paymentMethod3_text1').value = data.PaymentMethod3Text1;
//                     document.getElementById('staged-payment-fields').style.display = 'block';
//                 }
//                 if (data.PaymentMethod3Text2) document.getElementById('paymentMethod3_text2').value = data.PaymentMethod3Text2;
//                 if (data.PaymentMethod3Text3) document.getElementById('paymentMethod3_text3').value = data.PaymentMethod3Text3;
//                 if (data.PaymentDate3) document.getElementById('paymentDate3').value = data.PaymentDate3;
//                 if (data.PaymentWay) document.getElementById('paymentWay').value = data.PaymentWay;

//                 document.querySelectorAll('#tab3 input[type="checkbox"]').forEach(function (checkbox) {
//                     if (data.Options && data.Options[checkbox.id] && data.Options[checkbox.id].Result) {
//                         checkbox.checked = true;
//                         if (checkbox.nextElementSibling.textContent.trim() === '其他') {
//                             document.getElementById('OtherText').value = data.Options[checkbox.id].Text;
//                         }
//                     }
//                 });
//             }
//         });
//     });
// }


// function updateSelectedChildren() {
//     const selectedChildren = [];

//     document.querySelectorAll('#child-list .form-check-input').forEach(input => {
//         if (input.checked) {
//             selectedChildren.push(input.dataset.childName);

//             // 載入扶養費數據
//             const Local_Alimony = JSON.parse(localStorage.getItem('Alimony')) || [];
//             const index = Local_Alimony.findIndex(item => item.Child === input.dataset.childName);

//             if (index !== -1) {
//                 const data = Local_Alimony[index];

//                 // 更新支付方
//                 document.getElementById('Radio_WhoPay').checked = data.Radio_WhoPay.Result;
//                 document.getElementById('Radio_WhoPay1').checked = data.Radio_WhoPay1.Result;

//                 // 更新支付方式
//                 document.querySelectorAll('#tab3 input[type="radio"]').forEach(function (radioButton) {
//                     radioButton.disabled = false; // 確保支付方式可用
//                     if (data[radioButton.id]) {
//                         radioButton.checked = data[radioButton.id].Result;
//                         toggleFields(radioButton); // 顯示對應的支付方式欄位
//                     }
//                 });

//                 // 更新支付欄位
//                 if (data.PaymentDate1) {
//                     document.getElementById('paymentDate1').value = data.PaymentDate1;
//                     document.getElementById('one-time-payment-fields').style.display = 'block';
//                 }
//                 if (data.Payment1) document.getElementById('payment1').value = data.Payment1;

//                 if (data.PaymentDate2) {
//                     document.getElementById('paymentDate2').value = data.PaymentDate2;
//                     document.getElementById('installment-payment-fields').style.display = 'block';
//                 }
//                 if (data.Payment2) document.getElementById('payment2').value = data.Payment2;

//                 if (data.PaymentMethod3Text1) {
//                     document.getElementById('paymentMethod3_text1').value = data.PaymentMethod3Text1;
//                     document.getElementById('staged-payment-fields').style.display = 'block';
//                 }
//                 if (data.PaymentMethod3Text2) document.getElementById('paymentMethod3_text2').value = data.PaymentMethod3Text2;
//                 if (data.PaymentMethod3Text3) document.getElementById('paymentMethod3_text3').value = data.PaymentMethod3Text3;
//                 if (data.PaymentDate3) document.getElementById('paymentDate3').value = data.PaymentDate3;

//                 // 更新給付形式
//                 document.getElementById('Radio_pay').checked = data.Radio_pay.Result;
//                 document.getElementById('Radio_pay1').checked = data.Radio_pay1.Result;
//                 if (data.Radio_pay1.Result && data.PaymentWay) {
//                     document.getElementById('paymentWay').value = data.PaymentWay;
//                 }

//                 // 更新選項
//                 document.querySelectorAll('#tab3 input[type="checkbox"]').forEach(function (checkbox) {
//                     if (data.Options && data.Options[checkbox.id]) {
//                         checkbox.checked = data.Options[checkbox.id].Result;
//                         if (checkbox.id === 'Other') {
//                             document.getElementById('OtherText').value = data.Options[checkbox.id].Text;
//                         }
//                     }
//                 });
//             } else {
//                 // 清空欄位
//                 document.querySelectorAll('#tab3 input[type="radio"]').forEach(radio => {
//                     radio.checked = false;
//                     radio.disabled = false; // 確保所有 radio 可用
//                 });
//                 document.querySelectorAll('#tab3 input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
//                 document.getElementById('OtherText').value = '';
//                 document.getElementById('paymentDate1').value = '';
//                 document.getElementById('payment1').value = '';
//                 document.getElementById('paymentDate2').value = '';
//                 document.getElementById('payment2').value = '';
//                 document.getElementById('paymentMethod3_text1').value = '';
//                 document.getElementById('paymentMethod3_text2').value = '';
//                 document.getElementById('paymentMethod3_text3').value = '';
//                 document.getElementById('paymentDate3').value = '';
//                 document.getElementById('paymentWay').value = ''; // 清空給付形式
//             }
//         }
//     });

//     document.getElementById('selectedChildren3').textContent = selectedChildren.join(', ');
// }
