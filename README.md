# MASCAC Football — 2026 Season

A small, static website for the current MASCAC (NCAA Division III) football
season — the conference **Plymouth State** plays in. It shows:

- **Standings** computed live from conference and overall results.
- **Schedule & results** for every MASCAC team, merged into one list: final
  scores for games already played, kickoff times for upcoming games, and
  filters by team / status.
- A **live countdown** to the next kickoff, plus a per-game countdown on every
  upcoming game.
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
report/                    Four-page research report (Markdown + PDF + data)
```

## Research report

`report/` contains a four-page academic-style paper, *"Do Majors Make the Player?
Academic Fields and Football Performance Among Plymouth State's 2026 Opponents,"*
which studies the declared majors of every player at the programs Plymouth State
plays in 2026 (where public rosters list them) against those programs' results.

- `report/majors-and-football.md` — paper source
- `report/majors-and-football.pdf` — rendered PDF (pandoc + Tectonic)
- `report/data/players.csv`, `leaders.csv`, `team_results.csv`, `summary.json` — datasets
- `report/references.bib`, `report/build.sh` — bibliography and build script

Rebuild the PDF (requires `pandoc` and [Tectonic](https://tectonic-typesetting.github.io)):

```bash
cd report && ./build.sh
```

## Run locally

Because the page uses `fetch`, open it through a local web server (opening the
file directly also works in most browsers, but a server is safer):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

The site is a plain static site, so it can be served straight from the `main`
branch — no build step required.

**Current setup (branch-based):** GitHub Pages is configured with
*Source = Deploy from a branch*, branch `main`, folder `/`. Every push to
`main` republishes the site. This needs only `repo` scope on a token.

**Optional (Actions-based):** `.github/workflows/deploy.yml` is included for a
modern Actions deploy. To use it you must push the workflow file, which GitHub
only allows with a token that has the **`workflow`** scope:

```bash
git add -f .github/workflows/deploy.yml
git commit -m "Add Pages deploy workflow"
git push
```

Then set **Settings → Pages → Source = GitHub Actions**. The workflow builds
nothing and just publishes the static files.

To stand the project up from scratch:

```bash
git init
git add .
git commit -m "MASCAC Football 2026 site"
git branch -M main
git remote add origin https://github.com/<you>/mascac-football-2026.git
git push -u origin main
```

The site will be live at `https://<you>.github.io/mascac-football-2026/`.

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
