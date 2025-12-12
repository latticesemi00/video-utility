# Developer Guide

This guide covers contributing workflows, coding patterns, and how to add new features to the Lattice Video Timing & MIPI Configuration Calculator.

## Repository Layout

- `index.html` – landing page and navigation
- `config.html` + `app.js` – MIPI configuration & pixel-byte calculators
- `video_timing.html` + `video_timing.js` – video timing calculator
- `dphy.html` + `dphy.js` – soft D-PHY timing calculator
- `styles.css` – shared styling and responsive rules
- `imgs/` – diagrams, icons, and tooltip assets
- `README.md` – quick-start viewing info

## Local Setup

```bash
git clone http://git.latticesemi.com/hafiz.zaharudin/video-utility.git
cd video-utility
# or from GitHub:
# git clone https://github.com/hfz-zhrdn/video-utility.git
```

Open the folder in your IDE (VS Code/Cursor). These are static pages; open the HTML files directly in a browser for local testing.

Recommended to use Live Server extension in VS Code/Cursor Extension Marketplace.

With Live Server extension installed, right click on any `.html` file and click on `Open on Live Server` to view directly in browser.

## Git Workflow (recommended)

```bash
# keep master branch current
git checkout master
git pull origin master

# check status often
git status

# stage and commit
git add . #or git add --all
git commit -m "Add short description of change"

# push branch
git push origin master
```

## Linking Gitea to GitHub repository

### Auto-mirroring Gitea to GitHub

To set up _automatic_ mirroring from a source Gitea repository to a GitHub repository (so that every push made to Gitea is automatically synced to GitHub):

#### 1. **Create an empty repository on GitHub**

- Go to [https://github.com/new](https://github.com/new) and create a repository (do **not** initialize with README or .gitignore).

#### 2. **Get your GitHub repository URL**

- Example: `https://github.com/<your-username>/<repo-name>.git`

#### 3. **Set up a Push Mirror on Gitea**

- Go to your Gitea repo in the browser.
- Click on **Settings** > **Mirroring** in the left sidebar.
- Under **Push Mirror**, enter the GitHub HTTPS clone URL.
- Use your GitHub username and a [GitHub personal access token (PAT)](https://github.com/settings/tokens) as the password. (The PAT must include `repo` scope.)
- Click **Add Push Mirror**.

#### 4. **Mirror settings**

- Gitea will now automatically mirror every push to GitHub.

#### 5. **Test the mirroring**

- Push a change to Gitea (`git push origin master`).
- After a minute, check your GitHub repo for the update.

#### 6. **Tips & Notes**

- If mirroring fails, check the mirror status in Gitea’s "Mirroring" tab for errors (e.g., incorrect credentials).
- Use HTTPS for the mirror URL, not SSH.
- Make sure you are the Admin for the repository in Gitea to allow mirroring.

**References:**

- [Gitea Docs: Repository Mirroring](https://docs.gitea.com/usage/repository-mirroring)
- [GitHub Docs: Creating a personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

## Development Flow

1. Identify the page to change (`config.html`, `video_timing.html`, `dphy.html`, or `index.html`).
2. Update HTML for structure, JS for logic, and CSS if styling changes are shared.
3. Keep IDs/classes consistent with existing patterns.
4. Test in the browser (desktop + a mobile browser).
5. Run through the testing checklist (below).
6. Commit and push.

## How to Add a New Page

1. Create `new_page.html` using the shared header/nav and include `styles.css`.
2. Add your content inside `<main>`.
3. Add a script tag for your page logic (e.g., `your_script.js`).
4. Update the `<nav>` links in `index.html`, `config.html`, `video_timing.html`, and `dphy.html` to include the new page.
5. (Optional) Add the page to the home page list in `index.html`.

Starter HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Page Title</title>
    <link rel="stylesheet" href="styles.css" />
    <link rel="icon" type="image/png" href="imgs/favicon.ico" />
  </head>
  <body>
    <header class="main-banner">
      <div class="banner-content">
        <div style="display: flex; align-items: center">
          <a href="https://www.latticesemi.com/" target="_blank" rel="noopener">
            <img
              src="imgs/Lattice Logo Yellow_White.png"
              alt="Lattice Semiconductor Logo"
              class="banner-logo"
            />
          </a>
          <nav class="top-nav">
            <a href="index.html" class="nav-link">Home</a>
            <a href="config.html" class="nav-link">MIPI Configuration</a>
            <a href="dphy.html" class="nav-link">Soft D-PHY Parameter</a>
            <a href="video_timing.html" class="nav-link">Video Timing</a>
            <a href="new_page.html" class="nav-link">Your New Page</a>
          </nav>
        </div>
      </div>
    </header>
    <main></main>
    <script src="your_script.js"></script>
  </body>
</html>
```

## How to Add Input Fields (example: `config.html`)

1. Add the field in the inputs section (follow existing `.field-group` markup and include an error `<div>`).
2. Extend `inputFields` and `errorFields` arrays in `app.js`.
3. Add validation in `validateFields()` with clear messages.
4. Use the value inside the calculate handler.
5. (Optional) Add live validation in the input event listeners.

Number field pattern:

```html
<div class="field-group">
  <label for="input-new">Your Field Name</label>
  <input
    type="number"
    id="input-new"
    min="0"
    max="100"
    step="1"
    autocomplete="off"
    placeholder="0-100"
  />
  <div class="error-message" id="error-new"></div>
</div>
```

Validation snippet in `app.js`:

```javascript
let valNew = inputFields[5].value.trim();
let numValNew = Number(valNew);
if (
  !valNew ||
  isNaN(numValNew) ||
  numValNew < 0 ||
  numValNew > 100 ||
  !Number.isInteger(numValNew)
) {
  inputFields[5].classList.add("error");
  errorFields[5].textContent = "Enter a whole number between 0 and 100";
  errorFields[5].classList.add("active");
  if (!firstErrorInput) firstErrorInput = inputFields[5];
  valid = false;
} else {
  inputFields[5].classList.remove("error");
  errorFields[5].textContent = "";
  errorFields[5].classList.remove("active");
}
```

## How to Add Output Fields

1. Add an output `<div>` in the outputs section.
2. Add the element to `outputFields` (or reference it directly).
3. Set its text content during calculation.

```html
<div class="output-group">
  <span class="output-label">Your Output Label:</span>
  <span class="output-value" id="output-new">-</span>
</div>
```

## Tooltips and Info Messages

- Image tooltips: wrap the ⓘ trigger in a `.diagram-tooltip` with an inner `.diagram-tooltip-content` containing the image. Existing JS handles hover/click/modal behavior.
- Reminder/info boxes: create a styled `<div>` and toggle `display` in JS on calculate/clear.

## JSON Import/Export Pattern

- Add hidden file input + Import/Export buttons.
- Export: gather inputs/outputs, `JSON.stringify`, download via Blob.
- Import: parse JSON, validate required fields, populate inputs, show status message.  
  See existing implementations in `app.js`, `video_timing.js`, and `dphy.js` for exact patterns.

## Styling Guidelines

- Use shared CSS variables in `styles.css` (primary `#209dd8`, hover `#3eabde`, warning `#fcdf50`, error `#e53935`).
- Inputs/containers use gradient dark backgrounds; outputs use light yellow `#fefbe8`.
- Reuse classes: `.action-btn`, `.field-group`, `.output-group`, `.error-message`, `.bandwidth-card`, `.description-box`.

## Common JS Patterns

- Validation template (number, min/max, integer) already used across calculators.
- Show/hide sections: toggle `display` and a `.visible` class.
- Dropdown change handlers: update dependent fields per selection.

## Testing Checklist

- Inputs validate and errors clear on fix.
- Calculate works; outputs update and sections unhide.
- Clear resets fields and hides reminders.
- Navigation links work on all pages (including new ones).
- JSON export/import works and matches schema.
- Tooltips and modals display/close correctly.

## Troubleshooting Quick Hits

- Line rate range wrong: ensure `enforceLineRateBounds()` runs on device/package/speed change (`app.js`).
- Mode switch issues: verify `mode-select` listener and presence of `user-config-section` / `pxb-section`.
- Package/speed dropdown disabled: check `updateVisibilityForDefaults()` on device change.
- Outputs not showing: ensure outputs section is unhidden after calculation and IDs match JS.
- JSON import errors: confirm structure and validate before populating fields.

## Support

For questions, reach out to us (Rachel/Hafiz) at rnailing2004@gmail.com or mhafiz.1ak@gmail.com
