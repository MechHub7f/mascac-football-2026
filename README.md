# MASCAC Football — 2026 Season

A small, static website for the current MASCAC (NCAA Division III) football
season — the conference **Plymouth State** plays in. It shows:

- **Standings** computed live from conference and overall results.
- **Schedule & results** for every MASCAC team, merged into one list: final
  scores for games already played, kickoff times for upcoming games, and
  filters by team / status.
- **Players to watch** — one featured player from each of the nine teams with a
  short note about what they've done so far this season.

Schedule, scores and records are fetched **live in the browser** from ESPN's
public, CORS-enabled API, so results update on their own. No API key, no build
step, no server.

## Files

```
index.html                 Page shell
css/styles.css             Styling
js/data.js                 Teams list + editorial player notes (edit me)
js/app.js                  Live ESPN fetch + rendering
.github/workflows/deploy.yml   GitHub Pages deployment
.nojekyll                  Tell Pages to serve files as-is
```

## Run locally

Because the page uses `fetch`, open it through a local web server (opening the
file directly also works in most browsers, but a server is safer):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository and push this project to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "MASCAC Football 2026 site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. In the repository, go to **Settings → Pages** and set **Source =
   GitHub Actions**. The included workflow builds nothing and publishes the
   static files on every push to `main`.

3. The site will be live at `https://<you>.github.io/<repo>/`.

## Updating content

- **Teams / season:** edit `js/data.js`. Each team needs its ESPN team id
  (`espnId`) so the live feed can be pulled.
- **Player notes:** edit the `PLAYERS` map in `js/data.js`. These are editorial
  (there is no free API that produces a written blurb), seeded from the MASCAC
  individual leaders on `mascac.com`. Update them as the season goes on.

## Notes & limitations

- ESPN provides schedule, scores and records for these Division III teams but
  **not rosters or player box scores**, so the player write-ups are maintained
  by hand rather than generated from the API.
- "All games" includes non-conference opponents; conference games are tagged
  and can be isolated with the **Conference only** filter.
- Not affiliated with the MASCAC, the NCAA or ESPN.
