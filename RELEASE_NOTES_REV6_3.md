# Linux+ XK0-006 Certification Trainer — Rev 6.3

Rev 6.3 is a foundation and reliability release built directly from the uploaded GitHub repository.

## Highlights

- The former single-file application has been separated into HTML, CSS, and JavaScript files without intentionally changing exam behavior.
- The service worker now checks the network first for page navigations, helping browsers detect a newly published GitHub Pages revision sooner.
- Old Rev 6.2 caches are removed when the Rev 6.3 service worker activates.
- A `VERSION` file and formal changelog now identify the release.

## GitHub deployment

Replace the repository contents with the contents of this package, commit with a message such as `Release Rev 6.3`, and push to the branch used by GitHub Pages. Keep the directory structure intact.

After GitHub Pages finishes deploying, open the website once in Safari while online. An installed iPhone app may need to be fully closed and reopened once so the new service worker can activate.
