# Booker Prize Homepage

Prototype homepage for the Booker Prizes, imported from a Claude Design project.

- `index.html` — the homepage (a self-contained `.dc.html` design-component page)
- `support.js` — the design-component runtime that renders the `<x-dc>` markup
- `assets/`, `uploads/`, `figma/assets/` — images and fonts used by the page

## Running locally

Serve the folder over HTTP (the page loads `support.js`, fonts and images via relative URLs):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```
