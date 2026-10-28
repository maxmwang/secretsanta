# Secret Santa client

React app built with [Vite](https://vite.dev). Requires Node 22 (`nvm use` from the repo root).

- `npm start` – dev server on http://localhost:3000, proxies `/api` and `/socket.io` to the Express server on port 5000
- `npm run build` – production build to `dist/`, which `server.js` serves when `NODE_ENV=production`
- `npm run preview` – serve the production build locally

From the repo root, `npm run dev` starts both the server and the client.
