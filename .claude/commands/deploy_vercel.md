Deploy the frontend to Vercel by following these steps in order:

1. **Check Vercel CLI**: Run `vercel --version`. If the command fails (not found), install it with `npm i -g vercel`, then verify again.

2. **Check login status**: Run `vercel whoami`. If not logged in, tell the user to run `vercel login` manually first, then stop.

3. **Build the frontend**: Run `npm run build` to produce the production build in the `build/` directory. If the build fails, show the error and stop.

4. **Deploy to Vercel**: Run `vercel --prod --yes` to deploy the production build. This deploys only the frontend static files (no backend).

5. **Output the URL**: Extract the production URL from the Vercel CLI output and display it to the user. Format it clearly so they can click/copy it.

Important:
- Only deploy the frontend static files, not the backend server.
- If any step fails, stop and report the error clearly.
