/*
 * data.js — configuration and editorial content.
 *
 * SCHEDULE / SCORES / RECORDS are fetched live at runtime from ESPN's public
 * API (see js/app.js). Everything in THIS file is static and meant to be edited
 * by hand.
 *
 * The MASCAC is the NCAA Division III conference Plymouth State plays in.
 * ESPN team ids are listed per school so the live feed can be pulled.
 */

// ---- Season ---------------------------------------------------------------
const SEASON = 2026;
const LEAGUE_LABEL = "MASCAC Football";
const PLAYER_NOTES_AS_OF = "October 5, 2026";

// ---- Teams ----------------------------------------------------------------
// espnId    : ESPN team id used by the public API
// name      : short display name used throughout the UI
// fullName  : fuller name
// color     : accent color for the team card
const TEAMS = [
  { espnId: 2972,   name: "Plymouth St.",    fullName: "Plymouth State Panthers",   color: "#054e39" },
  { espnId: 402,    name: "Worcester St.",   fullName: "Worcester State Lancers",   color: "#004b8e" },
  { espnId: 18,     name: "Bridgewater St.", fullName: "Bridgewater State Bears",   color: "#bf2f38" },
  { espnId: 2967,   name: "Framingham St.",  fullName: "Framingham State Rams",     color: "#111111" },
  { espnId: 110,    name: "Mass. Maritime",  fullName: "Mass Maritime Buccaneers",  color: "#212c62" },
  { espnId: 2909,   name: "Westfield St.",   fullName: "Westfield State Owls",      color: "#1b509e" },
  { espnId: 114,    name: "Fitchburg St.",   fullName: "Fitchburg State Falcons",   color: "#024d36" },
  { espnId: 379,    name: "Mass.-Dartmouth", fullName: "UMass Dartmouth Corsairs",   color: "#0b2265" },
  { espnId: 110438, name: "Dean",            fullName: "Dean College Bulldogs",     color: "#10284b" },
];

const MASCAC_IDS = new Set(TEAMS.map((t) => t.espnId));

// ---- Featured player per team --------------------------------------------
// Editorial notes drawn from the MASCAC individual leaders (mascac.com) as of
// PLAYER_NOTES_AS_OF. Update these as the season progresses.
const PLAYERS = {
  2972: {
    player: "T.J. Taveras",
    position: "Defensive line",
    note: "Taveras has anchored the Panthers' front, racking up a team-high 3.5 sacks and 6.0 tackles for loss through four games — among the best marks in the conference.",
  },
  402: {
    player: "M.J. Bakaysa",
    position: "Quarterback",
    note: "Bakaysa leads the MASCAC with 1,212 passing yards and 11 touchdown passes over five games, completing 87 throws along the way.",
  },
  18: {
    player: "Jayden Barber",
    position: "Quarterback",
    note: "Barber owns the conference's top completion rate (71.8%) and pass-efficiency rating (184.0), throwing for 697 yards and 7 total touchdowns in four games.",
  },
  2967: {
    player: "Michael Marcucella",
    position: "Quarterback",
    note: "Marcucella has been the league's most explosive passer on a per-game basis, piling up 875 yards and 7 touchdowns in just three games (291.7 yards per game).",
  },
  110: {
    player: "Ray Gramlich",
    position: "Running back",
    note: "Gramlich has powered the Buccaneers' 3-0 start with a 6.3 yards-per-carry average, one of the top marks in the MASCAC.",
  },
  2909: {
    player: "Malachi Hymes",
    position: "Wide receiver",
    note: "Hymes has been the Owls' big-play target, hauling in 291 receiving yards and 4 touchdowns through four games.",
  },
  114: {
    player: "Reshawn Stewart",
    position: "Running back",
    note: "Stewart has carried the Fitchburg State ground game with 550 rushing yards and 6 touchdowns, averaging a hefty 7.1 yards per carry.",
  },
  379: {
    player: "Mekhi Wilson",
    position: "Running back",
    note: "Wilson leads the MASCAC in rushing at 143.8 yards per game, totaling 575 yards and 6 touchdowns on 83 carries for the Corsairs.",
  },
  110438: {
    player: "Chris Donohue",
    position: "Quarterback",
    note: "Donohue has been busy under center for the Bulldogs, completing 102 of 156 passes for 716 yards while averaging 179 passing yards per game.",
  },
};
