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
