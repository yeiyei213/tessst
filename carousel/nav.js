// fetch('nav.html')
// .then(res => res.text())
// .then(text => {
//     let oldelem = document.querySelector("script#replace_with_navbar");
//     let newelem = document.createElement("div");
//     newelem.innerHTML = text;
//     oldelem.parentNode.replaceChild(newelem,oldelem);
// })

/*fetch("nav.html") 
.then((response) => response.text()) 
.then((data) => { 
    let old_element = document.querySelector( "script#replace_with_navbar" ); 
    let new_element = new DOMParser() .parseFromString(data, "text/html") .querySelector("nav"); 
    old_element.parentNode.replaceChild(new_element, old_element); }) .catch((err) => console.log(err));*/




function loadNavbar(navFile) {
    fetch(navFile)
        .then(response => response.text())
        .then(data => {
            let old_element = document.querySelector("script#replace_with_navbar");
            let new_element = new DOMParser().parseFromString(data, "text/html").querySelector("nav");
            old_element.parentNode.replaceChild(new_element, old_element);
        })
        .catch(err => console.log(err));
}

// 檢查 localStorage
const navStatus = JSON.parse(localStorage.getItem('TestAnswer'));

if (!navStatus || !navStatus.Evaluate) {
    // 如果 localStorage 不存在或格式不正確，顯示 nav_no.html
    loadNavbar('nav_no.html');
    console.log('nav_no.html');
    console.log(localStorage.getItem('TestAnswer'));
    // 引導至quiz
    if(!document.URL.includes("quiz.html") && !document.URL.includes("resource.html")){
        window.location.replace("quiz.html");
    }
} else {
    const { isQ1, isQ2, isQ3 } = navStatus.Evaluate;
    if (isQ1 === '是' && isQ3 === '是') {
        // 如果 localStorage 中的值為 { "isQ1": "是", "isQ2": "是", "isQ3": "是" }，顯示 nav.html
        loadNavbar('nav.html');
        console.log('nav.html');
        console.log(localStorage.getItem('TestAnswer'));
    } else {
        // 如果 localStorage 中的值不符合上述條件，顯示 nav_no.html
        loadNavbar('nav_no.html');
        console.log('nav_no.html');
        console.log(localStorage.getItem('TestAnswer'));
    }
}

function show_more_menu(e) {
    var r = confirm("確定要清除所有填寫資料嗎？");
    if (r == true) {
        // 在這裡加入清除填寫的代碼
        localStorage.clear();
        window.location.assign("quiz.html");
    } else {
        // 如果用戶選擇"否"，則不會有任何動作
    }
}
