(function () {
  'use strict';

  var STORAGE_KEY = 'linuxplus-v69-confidence';
  var confidence = {};
  try { confidence = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (e) { confidence = {}; }

  function byId(id) { return document.getElementById(id); }
  function esc69(value) {
    if (typeof esc === 'function') return esc(String(value == null ? '' : value));
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  function saveConfidence() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(confidence)); } catch (e) {}
  }

  function objectiveDetail(q) {
    var area = (typeof objectiveFor === 'function') ? objectiveFor(q) : 'XK0-006 Review';
    var topic = q && q.moduleTitle ? q.moduleTitle : 'Linux administration';
    return area + ' • ' + topic;
  }

  function wrongReason(q, o) {
    var text = String(o && o.text || 'This choice');
    var p = (typeof purposeFor === 'function') ? purposeFor(text) : '';
    var stem = String(q && q.stem || '').toLowerCase();
    var all = (stem + ' ' + text.toLowerCase());

    var contrasts = [
      [/ssh-keygen/, 'ssh-keygen creates a key pair; it does not copy the public key into the remote account.'],
      [/ssh-keyscan/, 'ssh-keyscan collects a server host key for known_hosts; it does not configure user authentication.'],
      [/ssh-agent|ssh-add/, 'ssh-agent and ssh-add manage private keys in memory; they do not install a public key on the remote system.'],
      [/\blocate\b/, 'locate searches a prebuilt filename database, so its results can be stale and it does not evaluate live file attributes.'],
      [/\bfind\b/, 'find performs a live filesystem search; it is not the tool for searching inside file contents unless combined with another command.'],
      [/\bgrep\b/, 'grep searches text for matching patterns; it does not locate files by metadata such as age, owner, or permissions.'],
      [/\bchmod\b/, 'chmod changes permission bits; it does not change the file owner or owning group.'],
      [/\bchown\b/, 'chown changes ownership; it does not directly perform the permission change required here.'],
      [/\bchgrp\b/, 'chgrp changes only the owning group; it does not change the owner or permission bits.'],
      [/systemctl\s+start/, 'systemctl start affects the current session only; it does not make the service start automatically at boot.'],
      [/systemctl\s+enable/, 'systemctl enable configures boot-time activation but does not necessarily start the service immediately without --now.'],
      [/setenforce/, 'setenforce changes the current SELinux mode temporarily; it does not repair labels or create persistent policy mappings.'],
      [/chcon/, 'chcon changes a context directly, but that change can be overwritten by restorecon because it is not the preferred persistent mapping.'],
      [/restorecon/, 'restorecon reapplies the policy-defined default context; it does not define a new persistent context rule.'],
      [/\bcron\b|crontab/, 'cron is intended for recurring schedules; it is not the best choice for a single one-time job.'],
      [/\bat\b/, 'at schedules a command once; it does not provide a recurring schedule.'],
      [/raid\s*0/, 'RAID 0 improves performance through striping but provides no redundancy, so a single disk failure loses the array.'],
      [/raid\s*1/, 'RAID 1 mirrors data and tolerates a disk failure, but it does not provide the parity/capacity behavior described in this scenario.'],
      [/raid\s*5/, 'RAID 5 tolerates one disk failure; it does not meet a requirement for surviving two simultaneous failures.'],
      [/raid\s*6/, 'RAID 6 provides dual parity; it is unnecessary when the scenario asks for a different balance of capacity or fault tolerance.'],
      [/symbolic link|soft link/, 'A symbolic link stores a pathname and can become broken if the target moves; it is not another name for the same inode.'],
      [/hard link/, 'A hard link references the same inode and normally cannot cross filesystems or link directories, so it does not fit this requirement.'],
      [/nohup/, 'nohup keeps a process running after logout; it does not attach an existing job to the current terminal.'],
      [/\bjobs\b/, 'jobs lists shell jobs but does not move one into the foreground.'],
      [/\bfg\b/, 'fg brings a job to the foreground; it does not create, stop, or reprioritize the process.']
    ];
    for (var i = 0; i < contrasts.length; i++) {
      if (contrasts[i][0].test(all)) return contrasts[i][1];
    }
    if (p) return 'This option ' + p + ', but that is a different operation from the exact task requested in the scenario.';
    return 'This choice does not produce the requested Linux behavior. Compare the command’s primary purpose with the action verb in the question.';
  }

  var priorRationale = window.rationale;
  window.rationale = function (q, o) {
    if (q.correct.indexOf(o.label) !== -1) {
      return priorRationale ? priorRationale(q, o) : 'This choice performs the operation required by the scenario.';
    }
    return wrongReason(q, o);
  };

  function ensureConfidencePanel() {
    var stem = byId('qStem');
    if (!stem || byId('confidencePanel')) return;
    var panel = document.createElement('div');
    panel.id = 'confidencePanel';
    panel.className = 'confidence-panel';
    panel.innerHTML = '<span class="confidence-label">How confident are you?</span>' +
      '<div class="confidence-buttons" role="group" aria-label="Answer confidence">' +
      '<button type="button" class="btn confidence-btn" data-confidence="guess">Guess</button>' +
      '<button type="button" class="btn confidence-btn" data-confidence="somewhat">Somewhat sure</button>' +
      '<button type="button" class="btn confidence-btn" data-confidence="confident">Confident</button>' +
      '</div>';
    stem.insertAdjacentElement('afterend', panel);
    panel.querySelectorAll('.confidence-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        if (typeof exam === 'undefined' || !exam[idx]) return;
        confidence[exam[idx].id] = button.getAttribute('data-confidence');
        saveConfidence();
        refreshConfidence();
      });
    });
  }

  function refreshConfidence() {
    ensureConfidencePanel();
    if (typeof exam === 'undefined' || !exam[idx]) return;
    var value = confidence[exam[idx].id] || '';
    document.querySelectorAll('.confidence-btn').forEach(function (button) {
      var selected = button.getAttribute('data-confidence') === value;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  var baseRender = window.render;
  window.render = function () {
    baseRender.apply(this, arguments);
    refreshConfidence();
  };

  var baseShowFeedback = window.showFeedback;
  window.showFeedback = function (show) {
    baseShowFeedback.apply(this, arguments);
    if (!show || typeof exam === 'undefined' || !exam[idx]) return;
    var q = exam[idx], fb = byId('feedback');
    if (!fb || fb.querySelector('.rev69-learning-meta')) return;
    var labels = {guess:'Guess', somewhat:'Somewhat sure', confident:'Confident'};
    var selected = confidence[q.id];
    var correct = (typeof isCorrect === 'function') ? isCorrect(q) : false;
    var guidance = !selected ? 'Select a confidence rating to improve future adaptive practice.' :
      (selected === 'guess' && correct ? 'You answered correctly, but marked it as a guess. Keep this question in review until the concept feels automatic.' :
      (selected === 'confident' && !correct ? 'This was a high-confidence miss, so it should receive extra review priority.' :
      'Your confidence rating is saved with this question for future mastery tracking.'));
    fb.insertAdjacentHTML('beforeend', '<div class="rev69-learning-meta">' +
      '<div><strong>XK0-006 objective area:</strong> ' + esc69(objectiveDetail(q)) + '</div>' +
      '<div><strong>Your confidence:</strong> ' + esc69(selected ? labels[selected] : 'Not selected') + '</div>' +
      '<div><strong>Study guidance:</strong> ' + esc69(guidance) + '</div>' +
      '</div>');
  };

  window.LP69 = {
    version: '6.9',
    getConfidence: function (id) { return confidence[id] || ''; },
    allConfidence: function () { return JSON.parse(JSON.stringify(confidence)); }
  };

  ensureConfidencePanel();
})();
