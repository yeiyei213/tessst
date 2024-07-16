document.addEventListener('DOMContentLoaded', function () {
    loadRadioButton();
    //小結語
    $("#summary_Area").css("visibility", "hidden");



    // 從 LocalStorage 中獲取輸入框的資料
    const inputsData = JSON.parse(localStorage.getItem('Parents')) || {};
    const listItems = JSON.parse(localStorage.getItem('Children')) || [];

    const reminderData = JSON.parse(localStorage.getItem('reminderData')) || [];
    loadREADLocalStorage();

    // 將資料填充到相應的元素中
    if (inputsData.A) {
        document.querySelector('.A').textContent = inputsData.A;
    }

    if (inputsData.titleA) {
        document.querySelector('.titleA').textContent = inputsData.titleA;
    }

    if (inputsData.B) {
        document.querySelector('.B').textContent = inputsData.B;
    }

    if (inputsData.titleB) {
        document.querySelector('.titleB').textContent = inputsData.titleB;
    }

    // 動態生成未成年子女列表
    const childListContainer = document.getElementById('child-list');
    listItems.forEach((item, index) => {
        const formCheckDiv = document.createElement('div');
        formCheckDiv.className = 'form-check';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.name = 'radio_children';
        input.type = 'radio';
        input.id = `child-${index}`;
        input.dataset.childName = item; // 使用 dataset 來存儲未成年子女的名字

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = `child-${index}`;
        label.textContent = item;

        formCheckDiv.appendChild(input);
        formCheckDiv.appendChild(label);
        childListContainer.appendChild(formCheckDiv);

        // 添加事件監聽器
        input.addEventListener('change', updateSelectedChildren);
    });

    // 初始更新
    updateSelectedChildren();
    loadChildDataIcon();
    changeOptions();
});

function updateSelectedChildren() {
    const selectedChildren = [];
    const selectedChildren2 = [];
    const selectedChildren3 = [];

    document.querySelectorAll('#child-list .form-check-input').forEach(input => {
        if (input.checked) {
            selectedChildren.push(input.dataset.childName); // 使用 dataset 中的值
            selectedChildren2.push(input.dataset.childName);
            selectedChildren3.push(input.dataset.childName);


            // 載入ParentalRights
            const Local_ParentalRights = JSON.parse(localStorage.getItem('ParentalRights')) || [];
            const index = Local_ParentalRights.findIndex(item => item.Child === input.dataset.childName);

            if (index !== -1) {
                const data = Local_ParentalRights[index];
                Object.keys(data).forEach((key) => {
                    document.querySelectorAll('#tab1 input[type="radio"]').forEach(function (radioButton) {
                        if (radioButton.id == key) {
                            const result = data[key].Result;
                            radioButton.checked = result;
                        }

                    })
                })

                Object.keys(data.Options).forEach((key) => {
                    document.querySelectorAll('#tab1 input[type="checkbox"]').forEach(function (checkbox) {
                        if (checkbox.id == key) {
                            const result = data.Options[key].Result;
                            checkbox.checked = result;

                            if (key == 'Other') {
                                document.getElementById('OtherText').value = data.Options[key].Text;
                            }
                        }
                    })
                })

                loadSummary('ParentalRights', input.dataset.childName)
            }
            else {
                document.querySelectorAll('#tab1 input[type="radio"]').forEach(function (radioButton) {
                    radioButton.checked = false;
                })
                document.querySelectorAll('#tab1 input[type="checkbox"]').forEach(function (checkbox) {
                    checkbox.checked = false;
                })
                document.getElementById('OtherText').value = '';

                //小結語
                document.getElementById('All_Summary').innerText = "";
                $("#summary_Area").css("visibility", "collapse");
            }

            loadRadioButton();
        }
    });
    document.getElementById('selectedChildren').textContent = selectedChildren.join(', ');
    document.getElementById('selectedChildren2').textContent = selectedChildren2.join(', ');
    document.getElementById('selectedChildren3').textContent = selectedChildren3.join(', ');
}



// document.getElementById('flexCheckDefault').addEventListener('change', updateSelectedChildren);
// document.getElementById('flexCheckChecked').addEventListener('change', updateSelectedChildren);

updateSelectedChildren();


function loadSummary(item, c_name) {
    // 顯示summary_Area
    $("#summary_Area").css("visibility", "visible");

    // 取Data
    const Parents = JSON.parse(localStorage.getItem('Parents')) || {};
    const Local_ParentalRights = JSON.parse(localStorage.getItem('ParentalRights')) || [];
    const index = Local_ParentalRights.findIndex(item => item.Child === c_name);
    const data = Local_ParentalRights[index];
    name = data.Child;
    var myString = `未成年子女： ${name}\n權利義務約定：\n`;
    if (item == 'ParentalRights') {
      Custody = data.SoleCustody.Result == true ? '單獨監護' : '雙方共同監護';
      CustodyAB = data.SoleCustodyA.Result == true || data.JointCustodyA.Result == true ? Parents.A : Parents.B
      myString += `「親權」\n${Custody}，主要照顧者為${CustodyAB}。`;

      // CheckBox
      if (data.JointCustody.Result == true) {
        cnt = 0;
        items = '';
        Object.keys(data.Options).forEach((key) => {
          const result = data.Options[key].Result;
          const text = data.Options[key].Text;
          if (result == true) {
            items += text + '、';
            cnt++;
          }
        });

        if (cnt > 0) {
          items = items.slice(0, -1);
          myString += `\n 主要照顧者單獨行使條件：\n${items}`;
        }
      }
    }

    document.getElementById('All_Summary').textContent = myString;

  }

// 月份日期選單
// $(function() {
// $('#month').on('change', function() {
//     var date = new Date();
//     date.setMonth(+(this.value) + 1);
//     date.setDate(0);
//     var days = date.getDate(),
//         opts = [];

//         console.log(this.value);
//     for (var i = 0; i < days; i++) {
//         opts.push($('<option />', {
//             text: i + 1,
//             value: i + 1
//         }));
//     }
//     $('#day').html(opts);
// }).trigger('change');
// });


// $(function() {
// var days = [];
// for (var i = 0; i < 31; i++) {
// days.push($('<option />', {
//             text: i + 1,
//             value: i + 1
//         }));
//     }
// $('#days').html(days);   
// });

$(function () {
    $('.month').each(function () {
        var monthSelect = $(this);
        var daySelectId = this.id.replace('month', 'day');
        var daySelect = $('#' + daySelectId);

        monthSelect.on('change', function () {
            var selectedMonth = parseInt(this.value, 10);
            var date = new Date();
            date.setMonth(selectedMonth + 1);
            date.setDate(0);
            var daysInMonth = date.getDate();

            var opts = [];
            for (var i = 1; i <= daysInMonth; i++) {
                opts.push($('<option />', {
                    text: i + '日',
                    value: i
                }));
            }
            daySelect.html(opts);
        });
        monthSelect.trigger('change');
    });
});

// 切換頁籤
function changeTab(next) {
    document.getElementById(next).click();
    window.scrollTo(0, 200);
}


function read(tab) {
    saveREADToLocalStorage(tab);
    loadREADLocalStorage();
}

function loadREADLocalStorage() {
    reminderData = JSON.parse(localStorage.getItem('reminderData')) || [];
    if (Object.keys(reminderData).length > 0) {
        // TODO 要改寫
        for (let i = 1; i <= 3; i++) {
            tab = 'tab' + i.toString();
            tab_r = tab + '_reminder';
            if (!reminderData.includes(tab)) {
                document.getElementById(tab_r).style.display = "";
                document.getElementById(tab).style.display = "none";
            }
        }
        reminderData.forEach(data => {
            document.getElementById(data + '_reminder').style.display = "none";
            document.getElementById(data).style.display = "";
        })
    }
    else {
        for (let i = 1; i <= 3; i++) {
            tab = 'tab' + i.toString();
            tab_r = tab + '_reminder';

            document.getElementById(tab_r).style.display = "";
            document.getElementById(tab).style.display = "none";
        }
    }
}



function saveREADToLocalStorage(tab) {
    reminderData_now = JSON.parse(localStorage.getItem('reminderData')) || [];
    if (Object.keys(reminderData).length > 0) {
        reminderData_now.forEach(data => {
            if (!reminderData_now.includes(tab)) {
                reminderData_now.push(tab);
            }
        });
    }
    else {
        reminderData = [];
        reminderData_now.push(tab);
    }
    localStorage.setItem('reminderData', JSON.stringify(reminderData_now));
    console.log('Saved read:', reminderData_now);
}


function loadRadioButton() {
    if (document.getElementById("SoleCustody").checked) {
        $("#CareParentArea *").attr("disabled", false);
        $("#JointCustodyArea *").attr("disabled", true);
        $("#JointCustodyArea *").prop("checked", false);
        $("#JointCustodyArea label").css("opacity", "0.5");
    }
    else {
        $("#CareParentArea *").attr("disabled", true);
        $("#CareParentArea *").prop("checked", false);
    }

    if (document.getElementById("JointCustody").checked) {
        $("#JointCustodyArea *").attr("disabled", false);
        $("#CareParentArea *").attr("disabled", true);
        $("#CareParentArea *").prop("checked", false);
        $("#JointCustodyArea label").css("opacity", "");
    }
    else {
        $("#JointCustodyArea *").attr("disabled", true);
        $("#JointCustodyArea label").css("opacity", "0.5");
    }
}

function loadChildDataIcon() {
    document.querySelectorAll('#child-list .form-check-input').forEach(input => {
        const Local_ParentalRights = JSON.parse(localStorage.getItem('ParentalRights')) || [];
        const index = Local_ParentalRights.findIndex(item => item.Child === input.dataset.childName);

        if (index !== -1) {
            const parentElement = input.parentNode;
            for (const childNode of parentElement.childNodes) {
                if (childNode.id === 'btn_' + input.id) {
                    return;
                }
            }

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-outline-danger';
            delBtn.type = 'button';
            delBtn.setAttribute('style', 'margin-left: 10px; padding: 0px 5px');
            delBtn.id = 'btn_' + input.id;
            const trashIcon = document.createElement('svg');
            trashIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            trashIcon.setAttribute('width', '16');
            trashIcon.setAttribute('height', '16');
            trashIcon.setAttribute('fill', 'currentColor');
            trashIcon.setAttribute('class', 'bi bi-trash3');
            trashIcon.setAttribute('viewBox', '0 0 16 16');
            const path = document.createElement('path');
            path.setAttribute('d', 'M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5');
            trashIcon.appendChild(path);
            delBtn.appendChild(trashIcon);
            input.parentNode.appendChild(delBtn);

            delBtn.addEventListener('click', function () {
                if (confirm('確定要清除所選子女的照顧協議嗎?')) {
                    clearChildCareData();
                }
            });
        }
    })
}

// input.parentNode.appendChild(delBtn);
//0711很想死 超級
// 清除按鈕功能
function clearChildCareData() {
    localStorage.removeItem('ParentalRights');
    document.querySelectorAll('#tab1 input[type="radio"]').forEach(function (radioButton) {
        radioButton.checked = false;
    });
    document.querySelectorAll('#tab1 input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = false;
    });
    document.querySelectorAll('#tab1 input[type="text"]').forEach(function (input) {
        input.value = '';
    });
    document.querySelectorAll('#tab1 textarea').forEach(function (textarea) {
        textarea.value = '';
    });

    document.getElementById('All_Summary').textContent = '';
    document.getElementById('summary_Area').style.visibility = 'hidden';

    console.log('Cleared ParentalRights and Parents data from localStorage and form.');
}

function changeOptions() {

    const event = new Event('change');
    // 農曆過年
    // 約定：每年
    const LunarNewYear_eyon = document.getElementById('LunarNewYear_eyon');
    LunarNewYear_eyon.addEventListener('change', function () {
        const selectedValue = LunarNewYear_eyon.selectedIndex;
        console.log(selectedValue)
        if (selectedValue === 0) {
            $("#EveryYear_on").css("display", "none");
            $("#EveryYear_non").css("display", "none");
        }
        else if (selectedValue === 1) {
            document.getElementById('Radio_LunarNewYear1_b').checked = true;
            document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
            $("#EveryYear_on").css("display", "block");
            $("#EveryYear_non").css("display", "none");
        } else if (selectedValue === 2) {
            document.getElementById('Radio_LunarNewYear1_b').checked = true;
            document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
            $("#EveryYear_on").css("display", "none");
            $("#EveryYear_non").css("display", "block");
        }
    });
    // 農曆過年
    // 約定：單數年/雙數年
    const LunarNewYear_oyon = document.getElementById('LunarNewYear_oyon');
    LunarNewYear_oyon.addEventListener('change', function () {
        const selectedValue = LunarNewYear_oyon.selectedIndex;
        if (selectedValue === 0) {
            $("#OddYear_on").css("display", "none");
            $("#EvenYear_non").css("display", "none");
            $("#OddYear_non").css("display", "none");
            $("#EvenYear_on").css("display", "none");
        }
        else if (selectedValue === 1) {
            document.getElementById('Radio_LunarNewYear2_b').checked = true;
            document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
            // document.getElementById('Radio_LunarNewYear2_b').dispatchEvent(event);
            $("#OddYear_on").css("display", "block");
            $("#EvenYear_non").css("display", "block");
            $("#OddYear_non").css("display", "none");
            $("#EvenYear_on").css("display", "none");
            // 執行其他操作...
        } else if (selectedValue === 2) {
            document.getElementById('Radio_LunarNewYear2_b').checked = true;
            document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
            $("#OddYear_on").css("display", "none");
            $("#EvenYear_non").css("display", "none");
            $("#OddYear_non").css("display", "block");
            $("#EvenYear_on").css("display", "block");
        }
    });





    document.getElementById('Radio_LunarNewYear_b').addEventListener('change', function () {
        if (document.getElementById('Radio_LunarNewYear_b').checked) {
            document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
            document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
            // $("#EveryYear_on").css("display", "none");
            // $("#EveryYear_non").css("display", "none");
            // $("#OddYear_on").css("display", "none");
            // $("#EvenYear_non").css("display", "none");
            // $("#OddYear_non").css("display", "none");
            // $("#EvenYear_on").css("display", "none");
        }
    });
    //每年
    document.getElementById('Radio_LunarNewYear1_b').addEventListener('change', function () {
        if (document.getElementById('Radio_LunarNewYear1_b').checked) {
            document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
            document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
            // $("#OddYear_on").css("display", "block");
            // $("#EvenYear_non").css("display", "block");
            // $("#OddYear_non").css("display", "block");
            // $("#EvenYear_on").css("display", "block");
        }
    });
    document.getElementById('Radio_LunarNewYear2_b').addEventListener('change', function () {
        if (document.getElementById('Radio_LunarNewYear2_b').checked) {
            document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
            document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
            document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
            // $("#EveryYear_on").css("display", "block");
            // $("#EveryYear_non").css("display", "block");
        }
    });
















    //!!


    //   const LunarNewYear_be_eyon = document.getElementById('LunarNewYear_be_eyon');
    //     LunarNewYear_be_eyon.addEventListener('change', function() {
    //     const selectedValue = LunarNewYear_be_eyon.selectedIndex;
    //         console.log(selectedValue)
    //         if (selectedValue === 0) {
    //         $("#EveryYear_be_on").css("display", "none");
    //         $("#EveryYear_be_non").css("display", "none");
    //     }
    //     else if (selectedValue === 1) {
    //         document.getElementById('Radio_LunarNewYear1_b').checked =true;
    //         document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
    //         document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
    //         $("#EveryYear_on").css("display", "block");
    //         $("#EveryYear_non").css("display", "none");
    //     } else if (selectedValue === 2) {
    //         document.getElementById('Radio_LunarNewYear1_b').checked =true;
    //         document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
    //         document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
    //         $("#EveryYear_on").css("display", "none");
    //         $("#EveryYear_non").css("display", "block");
    //     }
    // });
    //     // 農曆過年
    //     // 約定：單數年/雙數年
    //     const LunarNewYear_oyon = document.getElementById('LunarNewYear_oyon');
    //     LunarNewYear_oyon.addEventListener('change', function() {
    //     const selectedValue = LunarNewYear_oyon.selectedIndex;
    //     if (selectedValue === 0) {
    //         $("#OddYear_on").css("display", "none");
    //         $("#EvenYear_non").css("display", "none");
    //         $("#OddYear_non").css("display", "none");
    //         $("#EvenYear_on").css("display", "none");
    //     }
    //     else if (selectedValue === 1) {
    //         document.getElementById('Radio_LunarNewYear2_b').checked =true;
    //         document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
    //         document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
    //         // document.getElementById('Radio_LunarNewYear2_b').dispatchEvent(event);
    //         $("#OddYear_on").css("display", "block");
    //         $("#EvenYear_non").css("display", "block");
    //         $("#OddYear_non").css("display", "none");
    //         $("#EvenYear_on").css("display", "none");
    //         // 執行其他操作...
    //     } else if (selectedValue === 2) {
    //         document.getElementById('Radio_LunarNewYear2_b').checked =true;
    //         document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
    //         document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
    //         $("#OddYear_on").css("display", "none");
    //         $("#EvenYear_non").css("display", "none");
    //         $("#OddYear_non").css("display", "block");
    //         $("#EvenYear_on").css("display", "block");
    //     }
    // });





    // document.getElementById('Radio_LunarNewYear_b').addEventListener('change', function () {
    //     if(document.getElementById('Radio_LunarNewYear_b').checked){
    //         document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
    //         document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
    //         document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
    //         document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
    //         // $("#EveryYear_on").css("display", "none");
    //         // $("#EveryYear_non").css("display", "none");
    //         // $("#OddYear_on").css("display", "none");
    //         // $("#EvenYear_non").css("display", "none");
    //         // $("#OddYear_non").css("display", "none");
    //         // $("#EvenYear_on").css("display", "none");
    //     }
    //   });
    //   //每年
    //     document.getElementById('Radio_LunarNewYear1_b').addEventListener('change', function () {
    //         if(document.getElementById('Radio_LunarNewYear1_b').checked){
    //             document.getElementById('LunarNewYear_oyon').selectedIndex = 0;
    //             document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
    //             document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
    //         // $("#OddYear_on").css("display", "block");
    //         // $("#EvenYear_non").css("display", "block");
    //         // $("#OddYear_non").css("display", "block");
    //         // $("#EvenYear_on").css("display", "block");
    //     }
    //   });
    //   document.getElementById('Radio_LunarNewYear2_b').addEventListener('change', function () {
    //         if(document.getElementById('Radio_LunarNewYear2_b').checked){
    //             document.getElementById('LunarNewYear_eyon').selectedIndex = 0;
    //             document.getElementById('LunarNewYear_eyon').dispatchEvent(event);
    //             document.getElementById('LunarNewYear_oyon').dispatchEvent(event);
    //             // $("#EveryYear_on").css("display", "block");
    //         // $("#EveryYear_non").css("display", "block");
    //     }
    //   });







}