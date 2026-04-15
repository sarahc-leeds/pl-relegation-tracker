import json, random
from collections import defaultdict

# Load match data
with open('/Users/sarahcurtis/Documents/pl-relegation-tracker/25-26-season.json') as f:
    data = json.load(f)

# Calculate points from completed matches
teams_points = defaultdict(int)
remaining_games = []

for m in data:
    if m['HomeTeamScore'] is not None and m['AwayTeamScore'] is not None:
        hs, aws = m['HomeTeamScore'], m['AwayTeamScore']
        if hs > aws:
            teams_points[m['HomeTeam']] += 3
        elif hs == aws:
            teams_points[m['HomeTeam']] += 1
            teams_points[m['AwayTeam']] += 1
        else:
            teams_points[m['AwayTeam']] += 3
    else:
        remaining_games.append(m)

# Bottom 6 teams (as of 15 April 2026)
bottom_6 = ['Leeds', "Nott'm Forest", 'West Ham', 'Spurs', 'Burnley', 'Wolves']

# User-stated current points (as of 15 April 2026)
user_points = {
    'Leeds': 36, "Nott'm Forest": 33, 'West Ham': 32,
    'Spurs': 30, 'Burnley': 20, 'Wolves': 17
}

print("=" * 65)
print("CURRENT POINTS VERIFICATION (JSON calculated vs User stated)")
print("=" * 65)
for team in bottom_6:
    calc = teams_points[team]
    stated = user_points[team]
    diff = stated - calc
    marker = "" if diff == 0 else f"  [diff: {diff:+d}]"
    print(f"  {team:20s}: Calculated={calc:3d}  Stated={stated:3d}{marker}")

# Override with user-stated points for bottom 6
for team, pts in user_points.items():
    teams_points[team] = pts

print(f"\n{'=' * 65}")
print("FULL CURRENT STANDINGS")
print("=" * 65)
sorted_all = sorted(teams_points.items(), key=lambda x: -x[1])
for i, (team, pts) in enumerate(sorted_all, 1):
    marker = " <<<" if team in bottom_6 else ""
    print(f"  {i:2d}. {team:20s} {pts:3d} pts{marker}")

# Remaining fixtures for bottom 6
print(f"\n{'=' * 65}")
print("REMAINING FIXTURES FOR BOTTOM 6 TEAMS")
print("=" * 65)

games_left = defaultdict(list)
for g in remaining_games:
    h, a = g['HomeTeam'], g['AwayTeam']
    rd = g['RoundNumber']
    for team in bottom_6:
        if h == team or a == team:
            opp = a if h == team else h
            venue = "HOME" if h == team else "AWAY"
            games_left[team].append((rd, opp, venue, g))

for team in bottom_6:
    fixtures = sorted(games_left[team], key=lambda x: x[0])
    print(f"\n  {team} ({user_points.get(team, teams_points[team])} pts) - {len(fixtures)} games remaining:")
    for rd, opp, venue, _ in fixtures:
        opp_pts = teams_points.get(opp, 0)
        b6_marker = " *B6*" if opp in bottom_6 else ""
        print(f"    R{rd:2d}: {venue:4s} vs {opp:20s} ({opp_pts} pts){b6_marker}")

# Head-to-head games remaining between bottom 6
h2h = []
for g in remaining_games:
    if g['HomeTeam'] in bottom_6 and g['AwayTeam'] in bottom_6:
        h2h.append(g)

print(f"\n{'=' * 65}")
print(f"HEAD-TO-HEAD REMAINING GAMES BETWEEN BOTTOM 6 ({len(h2h)} games)")
print("=" * 65)
for g in sorted(h2h, key=lambda x: x['RoundNumber']):
    print(f"  R{g['RoundNumber']:2d}: {g['HomeTeam']:20s} vs {g['AwayTeam']:20s}")

# Max/min possible points
print(f"\n{'=' * 65}")
print("POINTS RANGE (current + possible from remaining games)")
print("=" * 65)
for team in bottom_6:
    n = len(games_left[team])
    cur = user_points.get(team, teams_points[team])
    max_pts = cur + n * 3
    print(f"  {team:20s}: Current={cur:3d}, Games left={n}, Max possible={max_pts:3d}, Min={cur:3d}")

# Monte Carlo simulation
print(f"\n{'=' * 65}")
print("MONTE CARLO SIMULATION (200,000 iterations)")
print("=" * 65)

N_SIMS = 200000
random.seed(42)

relegation_count = defaultdict(int)
position_counts = defaultdict(lambda: defaultdict(int))
points_totals = defaultdict(list)

# Probability model: home win 45%, draw 25%, away win 30%
for sim in range(N_SIMS):
    sim_points = dict(teams_points)
    for game in remaining_games:
        r = random.random()
        if r < 0.45:
            sim_points[game['HomeTeam']] += 3
        elif r < 0.70:
            sim_points[game['HomeTeam']] += 1
            sim_points[game['AwayTeam']] += 1
        else:
            sim_points[game['AwayTeam']] += 3

    # Sort by points (tiebreak: random for simplicity)
    teams_list = list(sim_points.items())
    random.shuffle(teams_list)  # randomize before sort for tiebreak
    sorted_teams = sorted(teams_list, key=lambda x: -x[1])

    # Bottom 3 relegated
    relegated = set(t[0] for t in sorted_teams[-3:])
    for t in relegated:
        relegation_count[t] += 1

    # Track positions for bottom 6
    for pos, (team, pts) in enumerate(sorted_teams, 1):
        if team in bottom_6:
            position_counts[team][pos] += 1
            points_totals[team].append(pts)

print("\nRELEGATION PROBABILITY (bottom 6 focus):")
print("-" * 50)
for team in sorted(bottom_6, key=lambda t: -relegation_count[t]):
    pct = relegation_count[team] / N_SIMS * 100
    bar = "#" * int(pct / 2)
    print(f"  {team:20s}: {pct:6.2f}% {bar}")

# Any other teams with >0% relegation chance
print("\nOther teams with relegation risk:")
for team in sorted(relegation_count.keys(), key=lambda t: -relegation_count[t]):
    if team not in bottom_6 and relegation_count[team] > 0:
        pct = relegation_count[team] / N_SIMS * 100
        print(f"  {team:20s}: {pct:6.2f}%")

print(f"\n{'=' * 65}")
print("EXPECTED FINAL POINTS (from simulation)")
print("=" * 65)
for team in sorted(bottom_6, key=lambda t: -sum(points_totals[t])/len(points_totals[t])):
    pts = points_totals[team]
    avg = sum(pts) / len(pts)
    pts_sorted = sorted(pts)
    p5 = pts_sorted[int(0.05 * len(pts))]
    p25 = pts_sorted[int(0.25 * len(pts))]
    p50 = pts_sorted[int(0.50 * len(pts))]
    p75 = pts_sorted[int(0.75 * len(pts))]
    p95 = pts_sorted[int(0.95 * len(pts))]
    print(f"  {team:20s}: Avg={avg:.1f}  5th%={p5}  25th%={p25}  Median={p50}  75th%={p75}  95th%={p95}")

print(f"\n{'=' * 65}")
print("MOST LIKELY RELEGATED COMBINATIONS (top 15)")
print("=" * 65)

combo_count = defaultdict(int)
for sim in range(100000):
    sim_points = dict(teams_points)
    for game in remaining_games:
        r = random.random()
        if r < 0.45:
            sim_points[game['HomeTeam']] += 3
        elif r < 0.70:
            sim_points[game['HomeTeam']] += 1
            sim_points[game['AwayTeam']] += 1
        else:
            sim_points[game['AwayTeam']] += 3
    teams_list = list(sim_points.items())
    random.shuffle(teams_list)
    sorted_teams = sorted(teams_list, key=lambda x: -x[1])
    relegated = tuple(sorted(t[0] for t in sorted_teams[-3:]))
    combo_count[relegated] += 1

print(f"{'Combination':<60s} {'Probability':>10s}")
print("-" * 72)
for combo, count in sorted(combo_count.items(), key=lambda x: -x[1])[:15]:
    pct = count / 100000 * 100
    print(f"  {' + '.join(combo):<58s} {pct:6.2f}%")

# Safety analysis
print(f"\n{'=' * 65}")
print("SAFETY THRESHOLD ANALYSIS")
print("=" * 65)
SAFETY_LINE = 40
print(f"Points needed to reach {SAFETY_LINE} (projected survival line):")
for team in bottom_6:
    cur = user_points.get(team, teams_points[team])
    n = len(games_left[team])
    needed = max(0, SAFETY_LINE - cur)
    wins_needed = (needed + 2) // 3  # minimum wins (each win = 3 pts)
    remainder = needed - wins_needed * 3
    # If remainder is negative, we overshot — reduce wins and add draws
    if remainder < 0:
        draws_needed = needed % 3  # draws needed after wins
        wins_needed = needed // 3
        if draws_needed > 0:
            wins_needed_str = f"{wins_needed} win{'s' if wins_needed != 1 else ''} + {draws_needed} draw{'s' if draws_needed != 1 else ''}"
        else:
            wins_needed_str = f"{wins_needed} win{'s' if wins_needed != 1 else ''}"
    else:
        draws_needed = needed % 3
        wins_needed = needed // 3
        if draws_needed > 0:
            wins_needed_str = f"{wins_needed} win{'s' if wins_needed != 1 else ''} + {draws_needed} draw{'s' if draws_needed != 1 else ''}"
        else:
            wins_needed_str = f"{wins_needed} win{'s' if wins_needed != 1 else ''}"
    print(f"  {team:20s}: On {cur} pts, needs {needed} more pts from {n} games = {wins_needed_str} minimum")
