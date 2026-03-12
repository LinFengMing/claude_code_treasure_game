Deploy the frontend to GitHub Pages by following these steps in order. If any step fails, stop and report the error clearly.

---

## Step 1: Check GitHub CLI

Run `gh --version`. If the command fails (not found), install it with `brew install gh` (macOS). If brew is not available, tell the user to install gh manually from https://cli.github.com/ and stop.

## Step 2: Check GitHub Login

Run `gh auth status`. If not logged in, tell the user to run `gh auth login` manually first, then stop.

## Step 3: Check Git Repository

Run `git rev-parse --is-inside-work-tree`.
- If this is NOT a git repo, run `git init` to initialize one.
- Then ensure there is at least one commit. Run `git log --oneline -1`. If there are no commits, stage all files and create an initial commit.

## Step 4: Check GitHub Remote Repository

Run `gh repo view --json name,owner,url` to check if a GitHub remote is already linked.

- **If no remote exists:** Ask the user for the desired repo name (default: current directory name). Then run `gh repo create <repo-name> --public --source=. --remote=origin --push` to create the repo and push.
- **If a remote exists:** Confirm the remote URL and continue. Make sure local changes are committed and pushed to the remote with `git push origin main` (or the current branch).

Extract the GitHub username and repo name from the remote URL for later use.

## Step 5: Build the Frontend

Before building, temporarily configure Vite's `base` option for GitHub Pages:
- The GitHub Pages URL will be `https://<username>.github.io/<repo-name>/`, so the base path must be `/<repo-name>/`.
- Check `vite.config.ts` for the current `base` setting. If it is not set to `/<repo-name>/`, update it temporarily for this build.

Run `npm run build` to produce the production build in the output directory. If the build fails, revert the `base` change and stop.

After a successful build, revert the `base` change in `vite.config.ts` back to its original value (or remove it if it wasn't there before), so local development is not affected.

## Step 6: Deploy to GitHub Pages

Use the `gh-pages` npm package to deploy:

1. Check if `gh-pages` is installed: `npx gh-pages --version`. If not available, install it with `npm install -D gh-pages`.
2. Run `npx gh-pages -d build` (or whatever the output directory is) to push the build output to the `gh-pages` branch.
3. Wait for the command to complete.

## Step 7: Enable GitHub Pages on the Repository

Run the following to configure GitHub Pages to serve from the `gh-pages` branch:

```bash
gh api repos/<owner>/<repo>/pages -X POST -f build_type=legacy -f source='{"branch":"gh-pages","path":"/"}' 2>/dev/null || gh api repos/<owner>/<repo>/pages -X PUT -f build_type=legacy -f source='{"branch":"gh-pages","path":"/"}'
```

This creates or updates the Pages configuration. The POST creates it; if it already exists, the PUT updates it.

## Step 8: Output the Result

Display the following clearly to the user:

1. **GitHub Repo URL:** `https://github.com/<owner>/<repo>`
2. **GitHub Pages URL:** `https://<owner>.github.io/<repo>/`
3. A note that GitHub Pages may take 1-2 minutes to become available after the first deployment.
4. The user can check deployment status with: `gh api repos/<owner>/<repo>/pages/builds/latest --jq '.status'`

---

Important:
- Only deploy the frontend static files, not the backend server.
- Always revert the `base` path change in `vite.config.ts` after building, even if the build fails.
- If `gh-pages` deployment fails, check if the branch already exists and try again.
- Do not force-push to main or delete any branches without user confirmation.
