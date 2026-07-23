(function () {
  'use strict';

  function byId(id) { return document.getElementById(id); }

  function returnToSetup() {
    try { localStorage.removeItem('linuxplus-v3-state'); } catch (e) {}

    if (typeof exam !== 'undefined') exam = [];
    if (typeof idx !== 'undefined') idx = 0;
    if (typeof answers !== 'undefined') answers = {};
    if (typeof checked !== 'undefined') checked = {};
    if (typeof submitted !== 'undefined') submitted = false;
    if (typeof searchTerm !== 'undefined') searchTerm = '';
    if (typeof studyMode !== 'undefined') studyMode = 'normal';

    var search = byId('questionSearch');
    if (search) search.value = '';

    byId('examScreen').classList.add('hidden');
    byId('resultsScreen').classList.add('hidden');
    byId('startScreen').classList.remove('hidden');

    if (typeof setStartupStatus === 'function') {
      setStartupStatus('Exam exited without grading. Choose settings to begin another exam.', 'ok');
    }

    try {
      if (window.LP64 && typeof window.LP64.refreshHome === 'function') window.LP64.refreshHome();
    } catch (e) {}

    window.scrollTo(0, 0);
  }

  function exitExam() {
    var answered = 0;
    try {
      answered = exam.reduce(function (count, q) {
        return count + (((answers[q.id] || []).length > 0) ? 1 : 0);
      }, 0);
    } catch (e) {}

    var detail = answered ? ' You have answered ' + answered + ' question' + (answered === 1 ? '' : 's') + '.' : '';
    if (window.confirm('Exit this exam without grading?' + detail + ' This attempt will be discarded and no score will be recorded.')) {
      returnToSetup();
    }
  }

  var exitButton = byId('exitExamBtn');
  if (exitButton) exitButton.addEventListener('click', exitExam);

  // Make the header action useful during an active exam instead of reloading
  // and automatically restoring the same in-progress attempt.
  var restartTop = byId('restartTop');
  if (restartTop) {
    restartTop.textContent = 'New Exam';
    restartTop.onclick = function () {
      var examVisible = !byId('examScreen').classList.contains('hidden');
      if (examVisible && !submitted) exitExam();
      else {
        try { localStorage.removeItem('linuxplus-v3-state'); } catch (e) {}
        location.reload();
      }
    };
  }
})();
