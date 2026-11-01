# Fear 4Fangz – Competitive Esports Platform

An all-in-one competitive eSports ecosystem featuring AI-powered tactical coaching, live interactive strategy maps, scrim managers, tournament control centers, real-time WebSocket chat, player ranks, Fear Coins economy, and full roster directories.

---

## 🚀 Root Project Structure (GitHub & Render Ready)

`package.json` is located directly in the root directory:

```
├── package.json          <- Root package manifest (detected by GitHub & Render)
├── package-lock.json     <- Locked dependencies
├── server.ts             <- Express + WebSocket + Vite production server entry
├── vite.config.ts        <- Vite configuration with Tailwind CSS v4 & React
├── tsconfig.json         <- TypeScript configuration
├── index.html            <- SPA HTML entry point
├── render.yaml           <- Render Blueprint for automated web service setup
├── .env.example          <- Environment variables documentation
├── .gitignore            <- Git ignore rules (node_modules, dist, etc.)
└── src/
    ├── main.tsx          <- Client entry point
    ├── App.tsx           <- Core application component
    ├── data.ts           <- Tactical rosters, maps & tournament datasets
    ├── types.ts          <- Data contracts & TypeScript types
    ├── index.css         <- Global styling and Tailwind directives
    ├── assets/           <- Tactical map assets & imagery
    └── components/       <- Modular application components
```

---

## 🛠️ Render Deployment Instructions

### 1. Create a New Web Service on Render
1. Connect your GitHub repository containing this project.
2. Select **Node** runtime.

### 2. Configure Build & Start Commands
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm start`

### 3. Environment Variables (Render Dashboard)
Add the following under **Environment**:
* `NODE_ENV`: `production`
* `PORT`: `10000` (Render sets this automatically)
* `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key for real-time AI Coaching & Assistant features.

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Run production server**:
   ```bash
   npm start
   ```
