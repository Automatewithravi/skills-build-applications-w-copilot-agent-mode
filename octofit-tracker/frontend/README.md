# OctoFit Tracker presentation tier

React 19 and Vite frontend for the OctoFit Tracker application.

## API configuration

The frontend reads `VITE_CODESPACE_NAME` from Vite's environment. In Codespaces,
define it in `octofit-tracker/frontend/.env.local` using your Codespace name:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The app then calls `https://<VITE_CODESPACE_NAME>-8000.app.github.dev`. When the
variable is unset or blank, the app safely falls back to `http://localhost:8000`.
Restart the Vite dev server after changing `.env.local`.

## Development

```bash
npm run dev --prefix octofit-tracker/frontend
```
