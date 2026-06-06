'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ─── helpers ─── */
  function $(id) { return document.getElementById(id); }

  /* ─── collapsible sections ─── */
  function setupToggle(headingId, blockId) {
    var heading = $(headingId);
    var block   = document.getElementById(blockId).closest('.section-block');

    function toggle() {
      var isOpen = block.classList.toggle('open');
      heading.setAttribute('aria-expanded', isOpen);
    }

    heading.addEventListener('click', toggle);
    heading.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }

  setupToggle('ingredientsToggle', 'ingredientsList');
  setupToggle('stepsToggle',       'stepsList');

  /* ─── step walker ─── */
  var steps        = Array.from(document.querySelectorAll('.step-item'));
  var totalSteps   = steps.length;
  var currentStep  = 0;
  var cookingMode  = false;

  var startBtn     = $('startBtn');
  var nextBtn      = $('nextBtn');
  var resetBtn     = $('resetBtn');
  var progressSec  = $('progressSection');
  var progressFill = $('progressFill');
  var progressCur  = $('progressCurrent');
  var progressTot  = $('progressTotal');
  var progressPct  = $('progressPct');

  progressTot.textContent = totalSteps;

  function openStepsSection() {
    var stepsBlock = document.getElementById('stepsList').closest('.section-block');
    if (!stepsBlock.classList.contains('open')) {
      stepsBlock.classList.add('open');
      $('stepsToggle').setAttribute('aria-expanded', true);
    }
  }

  function highlightStep(index) {
    steps.forEach(function (s, i) {
      s.classList.remove('active');
      if (i < index)  s.classList.add('done');
      else            s.classList.remove('done');
    });
    if (index < totalSteps) {
      steps[index].classList.add('active');
      steps[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    updateProgress(index);
  }

  function updateProgress(index) {
    var pct = Math.round((index / totalSteps) * 100);
    progressFill.style.width = pct + '%';
    progressCur.textContent  = Math.min(index + 1, totalSteps);
    progressPct.textContent  = pct + '%';
  }

  startBtn.addEventListener('click', function () {
    if (cookingMode) return;
    cookingMode  = true;
    currentStep  = 0;

    openStepsSection();
    progressSec.style.display = 'block';
    highlightStep(currentStep);

    startBtn.style.display = 'none';
    nextBtn.style.display  = 'inline-flex';
    resetBtn.style.display = 'inline-flex';

    startTimer();
  });

  nextBtn.addEventListener('click', function () {
    currentStep++;
    if (currentStep < totalSteps) {
      highlightStep(currentStep);
    } else {
      steps.forEach(function (s) {
        s.classList.remove('active');
        s.classList.add('done');
      });
      progressFill.style.width = '100%';
      progressCur.textContent  = totalSteps;
      progressPct.textContent  = '100%';
      nextBtn.textContent      = '🎉 Done!';
      nextBtn.disabled         = true;
      clearInterval(timerInterval);
      $('timerDisplay').textContent    = '00:00';
      $('timerDisplay').classList.remove('pulse');
    }
  });

  resetBtn.addEventListener('click', function () {
    cookingMode = false;
    currentStep = 0;

    steps.forEach(function (s) {
      s.classList.remove('active', 'done');
    });

    progressFill.style.width   = '0%';
    progressCur.textContent    = '1';
    progressPct.textContent    = '0%';
    progressSec.style.display  = 'none';

    startBtn.style.display     = 'inline-flex';
    nextBtn.style.display      = 'none';
    nextBtn.textContent        = 'Next Step →';
    nextBtn.disabled           = false;
    resetBtn.style.display     = 'none';

    resetTimer();
  });

  /* ─── countdown timer (bonus) ─── */
  var COOK_SECONDS  = 15 * 60;
  var remaining     = COOK_SECONDS;
  var timerInterval = null;
  var timerRunning  = false;
  var timerBar      = $('timerBar');
  var timerDisplay  = $('timerDisplay');
  var timerToggle   = $('timerToggle');

  function formatTime(secs) {
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function startTimer() {
    remaining    = COOK_SECONDS;
    timerRunning = true;
    timerBar.style.display   = 'flex';
    timerDisplay.textContent = formatTime(remaining);
    timerDisplay.classList.add('pulse');

    timerInterval = setInterval(function () {
      if (!timerRunning) return;
      remaining--;
      timerDisplay.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = '00:00';
        timerDisplay.classList.remove('pulse');
        timerToggle.textContent  = 'Done';
        timerToggle.disabled     = true;
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning             = false;
    remaining                = COOK_SECONDS;
    timerBar.style.display   = 'none';
    timerDisplay.textContent = formatTime(COOK_SECONDS);
    timerDisplay.classList.remove('pulse');
    timerToggle.textContent  = 'Pause';
    timerToggle.disabled     = false;
  }

  timerToggle.addEventListener('click', function () {
    timerRunning = !timerRunning;
    timerToggle.textContent = timerRunning ? 'Pause' : 'Resume';
    if (timerRunning) {
      timerDisplay.classList.add('pulse');
    } else {
      timerDisplay.classList.remove('pulse');
    }
  });

});
