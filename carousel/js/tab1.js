// 監聽 radio button 的變化
document.getElementById("SoleCustody").addEventListener("change", function () {
    if (this.checked) {
      // 在這裡執行你的特定動作
      $("#CareParentArea *").attr("disabled", false);
      $("#JointCustodyArea *").attr("disabled", true);
      $("#JointCustodyArea *").prop("checked", false);
      $("#JointCustodyArea label").css("opacity", "0.5");
    }
  });
  document.getElementById("JointCustody").addEventListener("change", function () {
    if (this.checked) {
      // 在這裡執行你的特定動作
      $("#JointCustodyArea *").attr("disabled", false);
      $("#CareParentArea *").attr("disabled", true);
      $("#CareParentArea *").prop("checked", false);
      $("#JointCustodyArea label").css("opacity", "");
    }
  });

  function saveData(item) {

    console.log(childcare.ParentalRights);
    console.log(childcare.Visitation);
    console.log(childcare.Visitation.val);
    // TODO 無資料 -> 新增 / 有資料 -> 修改
    All_ParentalRights = [];
    ParentalRights = {};
    Options = {};

    // 取得小孩
    var radioButtons = document.getElementsByName('radio_children');
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        ParentalRights['Child'] = radioButtons[i].dataset.childName;
        break;
      }
    }

    if (ParentalRights.Child == null || ParentalRights.Child == '') {
      alert("請選擇子女！");
      return;
    }


    document.querySelectorAll('#tab1 input[type="radio"]').forEach(function (radioButton) {
      info = {};
      info['Result'] = radioButton.checked;
      info['Text'] = radioButton.nextElementSibling.textContent.trim();
      ParentalRights[radioButton.id] = info;
    });

    if (ParentalRights.SoleCustody.Result == false && ParentalRights.JointCustody.Result == false) {
      alert("請選擇單獨監護或雙方共同監護！");
      return;
    }
    if (ParentalRights.SoleCustody.Result == true && ParentalRights.SoleCustodyA.Result == false && ParentalRights.SoleCustodyB.Result == false) {
      alert("單獨監護請選擇照顧者！");
      return;
    }
    if (ParentalRights.JointCustody.Result == true && ParentalRights.JointCustodyA.Result == false && ParentalRights.JointCustodyB.Result == false) {
      alert("雙方共同監護請選擇主要照顧者！");
      return;
    }

    document.querySelectorAll('#tab1 input[type="checkbox"]').forEach(function (checkbox) {
      op = {};
      op['Result'] = checkbox.checked;
      if (checkbox.nextElementSibling.textContent.trim() == '其他自填') {
        op['Text'] = document.querySelector('#OtherText').value;
      }
      else {
        op['Text'] = checkbox.nextElementSibling.textContent.trim();
      }
      Options[checkbox.id] = op;
    });
    ParentalRights['Options'] = Options;


    existingData = JSON.parse(localStorage.getItem("ParentalRights"));
    if (existingData != null) {

      const indexToRemove = existingData.findIndex(item => item.Child === ParentalRights.Child);
      if (indexToRemove !== -1) {
        existingData.splice(indexToRemove, 1);
        console.log('886');
      }

      existingData.push(ParentalRights);
      localStorage.setItem('ParentalRights', JSON.stringify(existingData));
      console.log('Saved ParentalRights:', existingData);
    }
    else {
      All_ParentalRights.push(ParentalRights);
      localStorage.setItem('ParentalRights', JSON.stringify(All_ParentalRights));
      console.log('Saved ParentalRights:', All_ParentalRights);
    }


    loadSummary('ParentalRights', ParentalRights.Child);
    loadChildDataIcon();
  }

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


  // 其他自填 自動勾選/取消勾選清除資料
  // 監聽輸入文字框的變化
  document.getElementById('OtherText').addEventListener('input', function () {
    var inputValue = this.value.trim(); // 去除前後空格
    var checkbox = document.getElementById('Other');

    // 如果輸入文字框有值，則選中核取方塊；否則取消選中
    checkbox.checked = inputValue !== '';
  });

  document.getElementById('Other').addEventListener('change', function () {
    var inputElement = document.getElementById('OtherText');
    if (!this.checked) {
      inputElement.value = ''; // 清空輸入文字框的值
    }
  });