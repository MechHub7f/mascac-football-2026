---
title: "Do Majors Make the Player? Academic Fields and Football Performance Among Plymouth State's 2026 Opponents"
author: "MASCAC Football 2026 Data Report"
date: "October 5, 2026"
---

**Abstract.** This report asks which academic majors are associated with the strongest
college football players, using real 2026 data from the ten programs Plymouth State
(NCAA Division III) has played or will play. We combine official athletics rosters, which
publish each player's declared major at some — but not all — schools, with each program's
results so far. Seven of the ten programs publish majors, yielding 613 players with a
declared major out of 757 known rostered players. Business & Management is by far the most
common field (42.6%), followed by STEM & Engineering (23.0%, inflated by Massachusetts
Maritime Academy) and Criminal Justice & Social Sciences (13.9%); the majors popularly
assumed to "produce" athletes — kinesiology/exercise science (4.9%) and sport management
(3.6%) — are comparatively rare. Among 43 conference statistical leaders with a published
major, business is over-represented (53.5% vs. 42.6%; permutation *p* = .089; Cramér's
*V* = .194): suggestive, but not significant. We find no evidence that any major
"produces" better football players; the only strong team-performance signal (STEM-heavy
Mass Maritime starting 3–0) is confounded by that institution's specialized mission. The
defensible finding, therefore, is descriptive composition.

**Keywords:** academic clustering, NCAA Division III, football, majors, MASCAC,
ecological fallacy.

## 1. Introduction

Division III football occupies a distinctive place in American higher education: programs
offer no athletic scholarships, and players are admitted as ordinary students who, in
principle, choose their field of study freely. That freedom makes the sport an appealing
setting for a simple public question — *which majors produce the best football players?* —
and an equally appealing target for stereotypes that concentrate on kinesiology, exercise
science and sport management. A long line of scholarship has examined "academic
clustering," the tendency of student-athletes on a team to concentrate in a few majors
[@fountain2011; @paule2011], but it is dominated by Division I revenue sports, where
clustering is often tied to eligibility management.

This report assembles an original, reproducible dataset linking declared majors to on-field
results for the programs on Plymouth State's 2026 schedule, and is explicit about what such
data can support. We reframe the question into two answerable parts: (1) **composition** —
what is the academic-major composition of these rosters, and how well is it documented
publicly? and (2) **exploratory association** — among players whose majors are published,
is declared major associated with statistical prominence or team success? We deliberately
avoid the causal verb "produce," because the data cannot support it.

## 2. Data and Methods

### 2.1 Setting and sample

The sample is the ten programs on Plymouth State's 2026 schedule: Plymouth State, New
England College, Worcester State, Bridgewater State, Dean, Framingham State, Mass
Maritime, Westfield State, Fitchburg State, and UMass Dartmouth. Results are as of October
5, 2026.

### 2.2 Outcomes

Win–loss records, points for and against, and game-level scores were retrieved from the
ESPN public team-schedule API and cross-checked against the MASCAC standings
[@espn2026; @mascac2026]. Ordering matches the official conference table (e.g., Framingham
State and Mass Maritime tied at 3–0; Dean 0–4).

### 2.3 Roster and major data

Player names, positions, class years and declared majors were scraped from each program's
official athletics roster on October 5, 2026. Coverage is uneven and is itself a finding:
seven programs publish majors, one publishes them only for a fraction of the roster, and
two publish none (**Table 1**). The conference's
All-Academic Team announcements list honored players but not majors, so they could not
improve coverage.

### 2.4 Major coding

Raw major strings (93 distinct values) were collapsed into nine categories using a
documented keyword crosswalk: Business & Management; STEM & Engineering; Criminal Justice
& Social Sciences; Kinesiology & Sport Science; Sport Management; Health Sciences;
Communication & Media; Humanities, Arts & Education; and Undeclared/Other. Joint and
dual majors were assigned to their first-listed field. The complete crosswalk and
player-level coding are published in `report/data/`.

### 2.5 "Best player" proxy and analysis

Because individual quality is unavailable for all players (ESPN publishes no Division III
box scores), we operationalize "best" as **conference statistical prominence**: the
individual leaders published by the MASCAC (top five per statistical category). This yields
62 unique leaders, 43 of whom have a published major. Analyses are descriptive;
comparisons of leader versus roster composition use a chi-square statistic, Cramér's *V*,
and a 20,000-draw permutation test. No causal inference is warranted. Analyses were run in
Python; the paper was produced with pandoc and Tectonic.

## 3. Results

### 3.1 Coverage

Of 757 known rostered players, 613 (81.0%) have a published major (**Table 1**). Five
programs publish majors for their entire roster, Mass Maritime and Dean publish them
partially or fully with gaps, and New England College publishes none. The incomplete
coverage is the single largest constraint on any conclusion.

**Table 1. Data coverage by program.**

| Program | Rostered | With major | Coverage |
|:---|---:|---:|---:|
| Plymouth State | 99 | 99 | 100.0% |
| UMass Dartmouth | 131 | 131 | 100.0% |
| Worcester State | 74 | 74 | 100.0% |
| Framingham State | 95 | 95 | 100.0% |
| Fitchburg State | 76 | 76 | 100.0% |
| Mass Maritime | 125 | 124 | 99.2% |
| Dean | 76 | 14 | 18.4% |
| New England College | 81 | 0 | 0.0% |
| Bridgewater State | n/p | — | — |
| Westfield State | n/p | — | — |
| **Total (known)** | **757** | **613** | **81.0%** |

*Note: "n/p" = majors not published on the public roster.*

### 3.2 Composition

Business & Management dominates the sample at 42.6% (**Figure 1A**). STEM & Engineering is
second at 23.0%, but this is driven almost entirely by Mass Maritime Academy, where 85 of
141 STEM declarations (and 124 total majors) reside; excluding Mass Maritime, STEM falls
to roughly 10%. Criminal Justice & Social Sciences is a distant third at 13.9%. The
"athlete pipeline" fields — Kinesiology & Sport Science (4.9%) plus Sport Management
(3.6%) — together account for just 8.5% of declared majors. Composition varies sharply by
program (**Figure 2**): Mass Maritime is overwhelmingly technical, whereas business and
criminal justice dominate the regional state universities.

![Academic-major composition. (A) Share of the 613 players with a declared
major by category. (B) Statistical leaders (n = 43) versus the roster baseline; business
is the only category over-represented among leaders.](figures/fig1_composition.pdf){width=92%}

![Major composition by program (rostered players with a declared major).
Dean (*) publishes majors for only a fraction of its roster.](figures/fig2_by_program.pdf){width=88%}

### 3.3 Position and major

Majors are not distributed evenly across positions (**Figure 3**). Defensive backs and
skill players are the most business-oriented (Secondary 52.7%; Skill 46.2%), whereas
offensive and defensive linemen and linebackers are comparatively more likely to be in
STEM or criminal justice. Kinesiology is concentrated in skill positions. The overall
association is modest ($\chi^2$ = 59.10, df = 40, Cramér's *V* = .139, n = 612).

![Major category by position group (row percentages; n = 612 players with a
declared major).](figures/fig3_position_heatmap.pdf){width=84%}

### 3.4 Statistical leaders

Among the 43 statistical leaders with a published major, Business & Management is
over-represented: 53.5% versus 42.6% on the roster (**Figure 1B**; $\chi^2$ = 12.97, df = 8,
Cramér's *V* = .194; permutation *p* = .089). Notably, **not one** published leader is in
kinesiology/exercise science. The most productive players span fields: the top passer
(M. Bakaysa, Worcester State, 1,212 yards and 11 touchdowns) is a Business Administration
major; the next (M. Marcucella, Framingham State, 875 yards) studies Accounting; UMass
Dartmouth's J. Petrongolo (776 passing yards) is an Engineering major and the conference's
leading rusher, M. Wilson (575 yards), studies Communications. Worcester State's leading
receiver (L. Williams, 521 yards) is a Public Health major, while the sack leader
(T. Taveras, Plymouth State) studies Information Technology. The pattern is suggestive but
does not reach conventional significance, and multiple category comparisons inflate Type I
error.

### 3.5 Team performance

Team success shows no monotonic relationship with major mix. The two unbeaten programs are
opposites: Mass Maritime (3–0, +123 differential) fields an almost entirely STEM/technical
roster reflecting its maritime-engineering mission, while Framingham State (3–0) is
business-heavy. **Figure 4** plots team win percentage against each program's share of
business and STEM majors; neither relationship is monotonic, and the apparent STEM
advantage in success-weighted representation (players declaring STEM have a .73 mean team
win percentage and +25.8 mean margin) is produced by a single specialized institution, not
by STEM per se.

![Team win percentage versus the share of a program's roster in Business &
Management (A) and STEM & Engineering (B), for the seven programs that publish majors.
Institutional mission, not major, drives the visible pattern.](figures/fig4_success.pdf){width=90%}

## 4. Discussion

Within this sample, **business is the default major for Division III football players**,
and the majors popularly associated with athletics are a small minority. This mirrors the
academic-clustering literature's central observation — that rosters concentrate in a few
fields — but overturns the assumption about *which* fields: at these Division III
programs the cluster is in business, not kinesiology [@fountain2011].

The over-representation of business among statistical leaders is the most interesting
exploratory result. It may reflect the prominence of quarterbacks, who are both the most
heavily publicized players and more likely to choose business; it may reflect the large
baseline share of business; and it may be noise given *n* = 43. We report it as a
hypothesis, not a finding. The complete absence of kinesiology majors among published
leaders is striking but equally compatible with small numbers.

Crucially, the data provide **no support** for the claim that one major produces better
players. The apparent STEM advantage in team performance is an artifact of institutional
mission: Mass Maritime is a specialized academy whose entire curriculum is technical, so
"STEM" and "Mass Maritime" are nearly the same variable. This is a textbook confounding
problem, and it is why the honest answer to the original question is that it cannot be
answered with these data.

Two practical implications follow. For advisors, the finding that business rather than
sport science dominates DIII rosters is useful context. For the conference, the more
actionable issue is data availability: majors are missing for a substantial share of
players, which argues for a conference-wide reporting standard.

## 5. Limitations

1. **Coverage and selection bias.** Majors are published for only seven of ten programs;
   programs that publish may differ systematically from those that do not.
2. **Ecological fallacy.** Team results are not individual quality; relating team outcomes
   to major composition risks inferring individual behavior from group data
   [@robinson1950], and aggregation can reverse associations (Simpson's paradox)
   [@simpson1951].
3. **Weak quality proxy.** "Best player" is operationalized narrowly as top-five
   conference statistical prominence, a truncated, non-random selection.
4. **Small *n*, one season, multiple comparisons.** With 43 leaders in one season, effects
   are imprecise and exploratory.
5. **Measurement.** Majors are self-reported and inconsistently named, and our category
   crosswalk involves judgment.

## 6. Conclusion

Using real 2026 rosters and results from the programs Plymouth State has played and will
play, Business & Management is the modal major, "athlete" majors are rare, and statistical
leaders skew toward business without reaching significance. We find no evidence that any
major produces better football players; the strongest team-performance signal is
confounded by institutional mission. The defensible conclusion is descriptive: among the
Division III programs on Plymouth State's schedule, football talent comes from business and
general programs far more than from kinesiology or sport management. Answering the causal
version of the question would require player-level performance data and complete,
standardized major reporting across the conference.

## Data and code availability

Derived data are included in this repository under `report/data/` (`players.csv`,
`leaders.csv`, `team_results.csv`, `summary.json`). This report is exploratory and not peer
reviewed.
