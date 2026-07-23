## Rev 6.7
- Added short explanations for every correct answer across the full question bank.
- Replaced generic correct-answer confirmation with concept-specific reasoning.

# Changelog

## 6.3.0 — 2026-07-21

### Changed
- Extracted all presentation rules from `index.html` into `css/styles.css`.
- Extracted the exam engine into `js/app.js`.
- Extracted installation and service-worker setup into `js/pwa.js`.
- Reduced `index.html` from roughly 1.5 MB to a small application shell.
- Updated the visible application revision to 6.3.
- Added explicit semantic versioning through the `VERSION` file.

### Fixed
- Changed page navigation handling to network-first so a newly deployed GitHub Pages revision is less likely to remain hidden behind an older cached page.
- Advanced the offline cache name to `linuxplus-trainer-rev6-3`, which removes obsolete caches during activation.

### Preserved
- All 147 questions, existing reviewed content through Question 50, saved browser progress, exam grading, filters, search, dashboard, theme support, installation, and offline operation.


## 6.4.0 — First-Attempt Study Edition
- Added Favorites, Quick 10, Recent Misses, streak tracking, exam history, best score, and questions-practiced dashboard.
- Preserved existing filters, search, grading, review, saved progress, and offline support.

## Rev 6.5 — 2026-07-21
- Added Linux Coach, objective mastery tracking, Smart Review, Command Center v1, and Last-Hour Cram.
- Preserved Rev 6.4 progress and study tools.
- Updated PWA cache version for reliable deployment.

## Rev 6.8 — 2026-07-22
- Added a confirmed Exit Exam action that returns directly to Exam Setup.
- Exiting skips grading and does not record a score or mastery result.
- Fixed the header New Exam action restoring the same unfinished attempt.

## Rev 6.9
- Added per-question confidence ratings stored locally.
- Added stronger explanations for incorrect choices.
- Added objective-area and confidence-aware study guidance to answer feedback.

## Rev 7.0
- Added Mistake Notebook and Smart Favorites.
- Added per-question attempts, misses, correct streaks, mastery, dates, confidence signals, and personal notes.
- Added targeted practice modes for needs-review, mistakes, and low-confidence questions.
