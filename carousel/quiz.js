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

        $(document).ready(function () {
          const TestAnswer = JSON.parse(localStorage.getItem('TestAnswer'));
          if (!TestAnswer) {
              loadNavbar('nav_no.html');
          } else {
              const { isQ1: firstQuestionAnswer, isQ2: secondQuestionAnswer, isQ3: thirdQuestionAnswer } = TestAnswer.Evaluate;
              if (firstQuestionAnswer === 'No' || thirdQuestionAnswer === 'No') {
                  loadNavbar('nav_no.html');
              } else {
                  loadNavbar('nav.html');
              }
          }
      
          const numberSteps = $('.quiz__step').length - 1;
          let disableButtons = false;
          const tick = '<div class="answer__tick"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></div>';
      
          let customMessage = `
              <div class="video" style="text-align: center;">
                  <h2>為自己、為孩子，好好分手是重要且需要的~<br>若你與對方還沒準備好，可參考下列資源：</h2>
                  <br>
                  <h3 class="link" onclick="window.open('https://hahow.in/courses/60c84de9eb75ca46e0c25e85/discussions ', '_blank');">【我想離婚怎麼辦-兒福聯盟的離婚規劃課程】</h3>
                  <br>
                  <h3 class="link" onclick="window.open('https://www.youtube.com/watch?v=b2DGh8euMY', '_blank');">【兒福聯盟-思考離婚時的四件事】</h3>
                  <br>
                  <h3 class="link" onclick="window.open('https://www.tcpu.org.tw/psychological-related-institutions.html', '_blank');">【諮商資源-社團法人中華民國諮商心理師公會全國聯合會】</h3>
                  <br>
                  <button class="start" onclick="window.location.href='quiz.html'" style="margin-top: 5%; width: 150px; height: 48px; border-radius: 6px; border: 1px solid #14152C; background-color: transparent;">回首頁</button>
              </div>`;
      
          let video = `
              <div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px;">
                  <iframe width="500" height="315" src="https://www.youtube.com/embed/9ye50Ozqx74?si=-aAw052FsfaxH7xQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  <button class="start" onclick="window.location.href='info.html'" style="margin-top: 5%; width: 150px; height: 58px; border-radius: 6px; border: 1px solid green; align-items: center; background-color: transparent;" >開始填寫</button>
              </div>`;
      
          $('.answer__input').on('change', function (e) {
              if ($(this).next().children('.answer__tick').length > 0) {
                  return false;
              }
              $(this).next().append(tick);
          });
      
          $('.navigation__btn--right').click(function (e) {
              let currentIndex = Number($('.quiz__step--current').attr('data-question'));
              if ($('.quiz__step--current input:checked').length == 0) {
                  return false;
              }
              if (currentIndex == numberSteps + 1 || disableButtons == true) {
                  return false;
              }
              if (currentIndex + 1 == numberSteps + 1) {
                  $(this).addClass('navigation__btn--disabled');
              }
              if (currentIndex == numberSteps) {
                  $('.summary__item').remove();
                  $('.quiz__step:not(.quiz__summary)').each(function (index, item) {
                      let icon = $(item).children('.question__emoji').text();
                      let answer = $(item).children('.answer').find('input:checked').val();
                      let node = '<div class="summary__item" style="font-size:30px;"><div class="question__emoji" style="font-size:30px;">' + icon + '</div>' + answer + '</div>';
                      $('#summary').append(node);
                  });
              }
              const percentage = (currentIndex * 100) / numberSteps;
              $('.progress__inner').width(percentage + '%');
              $('.quiz__step--current').hide('300');
              $('.quiz__step--current').removeClass('quiz__step--current');
              $('.quiz__step--' + (currentIndex + 1)).show('300').addClass('quiz__step--current');
              currentIndex = Number($('.quiz__step--current').attr('data-question'));
              if (currentIndex > 1) {
                  $('.navigation__btn--left').removeClass('navigation__btn--disabled');
              }
          });
      
          $('.navigation__btn--left').click(function (e) {
              let currentIndex = Number($('.quiz__step--current').attr('data-question'));
              if (currentIndex == 1 || disableButtons == true) {
                  $(this).addClass('navigation__btn--disabled');
                  return false;
              }
              $('.navigation__btn--right').removeClass('navigation__btn--disabled');
              $('.quiz__step--current').hide('300');
              $('.quiz__step--current').removeClass('quiz__step--current');
              $('.quiz__step--' + (currentIndex - 1)).show('300').addClass('quiz__step--current');
              currentIndex = Number($('.quiz__step--current').attr('data-question'));
              if (currentIndex == 1) {
                  $(this).addClass('navigation__btn--disabled');
              }
              const percentage = ((currentIndex - 1) * 100) / numberSteps + 1;
              $('.progress__inner').width(percentage + '%');
              $('.quiz__step--current').keyup(keypressEvent);
          });
      
          $('.submit').click(function (e) {
              e.preventDefault();
              const firstQuestionAnswer = $('.quiz__step--1 input:checked').val();
              const secondQuestionAnswer = $('.quiz__step--2 input:checked').val();
              const thirdQuestionAnswer = $('.quiz__step--3 input:checked').val();
              let TestAnswer = {
                  "Evaluate": {
                      "isQ1": firstQuestionAnswer,
                      "isQ2": secondQuestionAnswer,
                      "isQ3": thirdQuestionAnswer
                  }
              };
              localStorage.setItem('TestAnswer', JSON.stringify(TestAnswer));
              console.log(TestAnswer);
              if (firstQuestionAnswer === '否' || thirdQuestionAnswer === '否') {
                  $('.quiz').remove();
                  $(customMessage).appendTo('.container');
                  localStorage.clear();
              } else {
                  $('.quiz').remove();
                  $(video).appendTo('.container');
              }
              disableButtons = true;
              $('.navigation__btn').addClass('navigation__btn--disabled');
          });
      });
      