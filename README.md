# ✅ HabitTrack — Daily Habit Tracker

Beautiful, minimal daily habit tracker that runs entirely in your browser.

Track habits, build streaks, and see your consistency at a glance with an interactive calendar heatmap.

## Features

- Add habits with emoji icons
- One-click daily check-ins
- Automatic current streak + lifetime total
- **Interactive calendar heatmap** — click any streak to open a 6-month visual history and toggle past days
- Today's progress + completion percentage
- Fully offline (everything saved in localStorage)
- No sign-up, no backend, no tracking

## Run locally

```bash
git clone https://github.com/facingshootingstar/HabitTrack.git
cd HabitTrack
# Just open index.html in any browser
```

Or use a simple local server:
```bash
npx serve .
```

## Deploy to GitHub Pages (free)

1. Push your changes to the `master` branch.
2. Go to your repo → **Settings** → **Pages**.
3. Under "Build and deployment", set:
   - Source: **Deploy from a branch**
   - Branch: `master`
   - Folder: `/ (root)`
4. Click **Save**. Your site will be live in ~1 minute at:
   ```
   https://facingshootingstar.github.io/HabitTrack/
   ```

## Tech

Pure vanilla HTML + CSS + JavaScript (~150 lines total). MIT License.
