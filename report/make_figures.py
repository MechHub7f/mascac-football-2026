import csv, collections, json
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import rcParams
import numpy as np, os

rcParams.update({
    "font.family": "serif",
    "font.serif": ["DejaVu Serif"],
    "font.size": 8,
    "axes.titlesize": 9,
    "axes.titleweight": "bold",
    "axes.labelsize": 8,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "figure.dpi": 200,
    "savefig.bbox": "tight",
    "pdf.fonttype": 42,
})

import os
BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "figures")
os.makedirs(OUT, exist_ok=True)

def read_csv(p):
    with open(p, newline="") as f:
        return list(csv.DictReader(f))

players = read_csv(os.path.join(BASE, "data/players.csv"))
leaders = read_csv(os.path.join(BASE, "data/leaders.csv"))
results = {r["school"]: r for r in read_csv(os.path.join(BASE, "data/team_results.csv"))}
summary = json.load(open(os.path.join(BASE, "data/summary.json")))

# ---- palette
PAL = {
    "Business & Management": "#1f4e79",
    "STEM & Engineering": "#2e8b57",
    "Criminal Justice & Social Sciences": "#b8860b",
    "Kinesiology & Sport Science": "#c0504d",
    "Undeclared / Other": "#8c8c8c",
    "Sport Management": "#7f6ea8",
    "Health Sciences": "#4f95c4",
    "Humanities, Arts & Education": "#d98b3a",
    "Communication & Media": "#5aa469",
}
wm = [p for p in players if p["major_category"]]
N = len(wm)
comp = collections.Counter(p["major_category"] for p in wm)
cats = [c for c, _ in comp.most_common()]

SHORT = {
    "Business & Management": "Business",
    "STEM & Engineering": "STEM",
    "Criminal Justice & Social Sciences": "Crim. justice",
    "Kinesiology & Sport Science": "Kinesiology",
    "Undeclared / Other": "Undeclared",
    "Sport Management": "Sport mgmt",
    "Health Sciences": "Health sci.",
    "Humanities, Arts & Education": "Humanities",
    "Communication & Media": "Communication",
}

# unique leaders with a major
seen = {}
for L in leaders:
    k = (L["team"], L["player"])
    if k not in seen or (not seen[k]["major_category"] and L["major_category"]):
        seen[k] = L
lwm = [L for L in seen.values() if L["major_category"]]
ld = collections.Counter(L["major_category"] for L in lwm)
nl = len(lwm)

# ============================================================ Figure 1
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(6.6, 2.9))
y = np.arange(len(cats))[::-1]
vals = [100 * comp[c] / N for c in cats]
ax1.barh(y, vals, color=[PAL[c] for c in cats], height=0.72)
ax1.set_yticks(y); ax1.set_yticklabels(cats, fontsize=7)
ax1.set_xlabel("Share of players with a declared major (%)")
ax1.set_title("A. Major composition (n = 613)")
for yi, v in zip(y, vals):
    ax1.text(v + 0.7, yi, f"{v:.1f}", va="center", fontsize=6.5)
ax1.set_xlim(0, max(vals) * 1.18)

# leaders vs roster paired
show = cats[:7]
yy = np.arange(len(show))[::-1]
roster = [100 * comp[c] / N for c in show]
lead = [100 * ld.get(c, 0) / nl for c in show]
h = 0.36
ax2.barh(yy + h / 2, roster, height=h, color="#c9d3dd", label="Roster (n=613)")
ax2.barh(yy - h / 2, lead, height=h, color="#1f4e79", label="Statistical leaders (n=43)")
ax2.set_yticks(yy); ax2.set_yticklabels([SHORT[c] for c in show], fontsize=6.5)
ax2.set_xlabel("Share (%)")
ax2.set_title("B. Leaders vs. roster baseline")
ax2.legend(frameon=False, fontsize=6.5, loc="lower right")
for yi, v in zip(yy - h / 2, lead):
    ax2.text(v + 0.8, yi, f"{v:.0f}", va="center", fontsize=6)
ax2.set_xlim(0, 62)
fig.savefig(f"{OUT}/fig1_composition.pdf")
plt.close(fig)

# ============================================================ Figure 2
schools = [s for s in summary["coverage"] if summary["coverage"][s]["with_major"] > 0]
order = sorted(schools, key=lambda s: -summary["coverage"][s]["with_major"])
short = {"Plymouth St.": "Plymouth St.", "UMass Dartmouth": "UMass Dartmouth",
         "Worcester St.": "Worcester St.", "Framingham St.": "Framingham St.",
         "Fitchburg St.": "Fitchburg St.", "Mass Maritime": "Mass Maritime", "Dean": "Dean*"}
top = cats[:6]
fig, ax = plt.subplots(figsize=(6.6, 2.7))
left = np.zeros(len(order))
for c in top:
    share = []
    for s in order:
        tot = sum(1 for p in wm if p["school"] == s)
        share.append(100 * sum(1 for p in wm if p["school"] == s and p["major_category"] == c) / tot)
    share = np.array(share)
    ax.barh(order, share, left=left, color=PAL[c], label=c, height=0.7)
    left += share
other = 100 - left
ax.barh(order, other, left=left, color="#cfcfcf", height=0.7, label="Other")
ax.set_yticklabels([short.get(s, s) for s in order], fontsize=7.5)
ax.set_xlabel("Share of rostered players with a declared major (%)")
ax.set_xlim(0, 100)
ax.set_title("Major composition by program")
ax.legend(frameon=False, fontsize=6.2, ncol=3, loc="upper center", bbox_to_anchor=(0.5, -0.32))
fig.savefig(f"{OUT}/fig2_by_program.pdf")
plt.close(fig)

# ============================================================ Figure 3 (heatmap)
posg = ["Skill (QB/RB/WR/TE)", "Offensive Line", "Defensive Line", "Linebackers", "Secondary", "Specialists"]
cols = cats[:6]
M = np.zeros((len(posg), len(cols)))
for i, pg in enumerate(posg):
    rows = [p for p in wm if p["position_group"] == pg]
    for j, c in enumerate(cols):
        M[i, j] = 100 * sum(1 for p in rows if p["major_category"] == c) / len(rows)
fig, ax = plt.subplots(figsize=(6.4, 2.7))
im = ax.imshow(M, cmap="Blues", aspect="auto", vmin=0, vmax=60)
ax.set_xticks(range(len(cols)))
ax.set_xticklabels([SHORT[c] for c in cols], fontsize=7, rotation=0)
ax.set_yticks(range(len(posg)))
ax.set_yticklabels([f"{p}" for p in posg], fontsize=7.5)
for i in range(len(posg)):
    for j in range(len(cols)):
        ax.text(j, i, f"{M[i, j]:.0f}", ha="center", va="center",
                fontsize=6.5, color="white" if M[i, j] > 32 else "#222")
ax.set_title("Major category by position group (row %, n = 612)")
cbar = fig.colorbar(im, ax=ax, fraction=0.03, pad=0.02)
cbar.set_label("Row share (%)", fontsize=7)
cbar.ax.tick_params(labelsize=6)
fig.savefig(f"{OUT}/fig3_position_heatmap.pdf")
plt.close(fig)

# ============================================================ Figure 4 (scatter)
fig, (axa, axb) = plt.subplots(1, 2, figsize=(6.6, 2.7), sharey=True)
for ax, cat, ttl in [(axa, "Business & Management", "A. Business & Management"),
                     (axb, "STEM & Engineering", "B. STEM & Engineering")]:
    xs, ys, labs = [], [], []
    for s in order:
        tot = sum(1 for p in wm if p["school"] == s)
        share = 100 * sum(1 for p in wm if p["school"] == s and p["major_category"] == cat) / tot
        wp = 100 * float(results[s]["win_pct"])
        xs.append(share); ys.append(wp); labs.append(short.get(s, s))
    ax.scatter(xs, ys, s=42, color=PAL[cat], zorder=3)
    for x, y, l in zip(xs, ys, labs):
        ax.annotate(l, (x, y), textcoords="offset points", xytext=(4, 3), fontsize=6)
    ax.set_xlabel(f"Share of roster in category (%)")
    ax.set_title(ttl)
    ax.set_ylim(-5, 105)
    ax.grid(axis="y", color="#eeeeee")
axa.set_ylabel("Team win percentage (%)")
fig.suptitle("Team success vs. major concentration (7 programs with published majors)", fontsize=8.5, y=1.02)
fig.savefig(f"{OUT}/fig4_success.pdf")
plt.close(fig)

print("figures written to", OUT)
for f in sorted(os.listdir(OUT)):
    print("  ", f, os.path.getsize(os.path.join(OUT, f)), "bytes")
