# Project Migration & GitHub Pages Setup Guide

## 1. Directory Structure Migration
* **Action**: Moved all files from the `MacroAnalysis-dashboard` subfolder to the root directory.
* **Reason**: To simplify the project structure and align with standard Vite/GitHub Pages deployment patterns.
* **Cleanup**: Deleted the now-empty `MacroAnalysis-dashboard` folder to prevent configuration conflicts.

## 2. Local Configuration Fixes
* **Tailwind CSS**: Updated `tailwind.config.js` to correctly scan the root `index.html` and the `src` directory. Without this, styles were not being generated for the moved files.
* **Data Handling**: 
    * Created `src/data/macroData.json` as a placeholder to prevent the React app from crashing on initial import.
    * Modified `scripts/fetch-fred-data.cjs` to include `fs.mkdirSync(dataDir, { recursive: true })`. This ensures the data folder is created automatically during the automated build process if it doesn't exist.

## 3. CI/CD Pipeline (GitHub Actions)
* **Node.js Upgrade**: Upgraded the environment from Node 20 to **Node 24** to resolve deprecation warnings and future-proof the build.
* **Action Versions**: 
    * Upgraded `actions/checkout` and `actions/setup-node` to **v6**.
    * Upgraded `peaceiris/actions-gh-pages` to **v4**.
* **Permissions**: Added `permissions: contents: write` to the workflow file. This is required for the `GITHUB_TOKEN` to successfully push the compiled code to the `gh-pages` branch.
* **Compatibility Bridge**: Added the `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` environment variable to suppress warnings for third-party actions that haven't natively moved to Node 24 yet.

## 4. GitHub Pages Deployment
* **Vite Base Path**: Configured `base: '/MacroAnalysis-App/'` in `vite.config.js` to ensure assets (CSS/JS) load correctly when hosted under a sub-path on GitHub.
* **Branch Strategy**:
    * The workflow builds the project and pushes the `dist` folder to a new branch called `gh-pages`.
    * **Settings Adjustment**: In the GitHub repository Settings > Pages, the source was set to "Deploy from a branch" using the `gh-pages` branch.

## 5. Final Verification
* **Build Test**: Ran `npm run build` locally to ensure the root-level configuration was valid.
* **Deployment**: Verified the live site at `https://berzrekeley.github.io/MacroAnalysis-App/`.
