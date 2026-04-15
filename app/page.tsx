"use client";

import { useState, useEffect } from "react";

const standings = [
  { pos: 1, team: "Arsenal", pts: 70 },
  { pos: 2, team: "Man City", pts: 64 },
  { pos: 3, team: "Aston Villa", pts: 55 },
  { pos: 4, team: "Man Utd", pts: 55 },
  { pos: 5, team: "Liverpool", pts: 52 },
  { pos: 6, team: "Chelsea", pts: 48 },
  { pos: 7, team: "Brentford", pts: 47 },
  { pos: 8, team: "Everton", pts: 47 },
  { pos: 9, team: "Brighton", pts: 46 },
  { pos: 10, team: "Sunderland", pts: 46 },
  { pos: 11, team: "Bournemouth", pts: 45 },
  { pos: 12, team: "Fulham", pts: 44 },
  { pos: 13, team: "Crystal Palace", pts: 42 },
  { pos: 14, team: "Newcastle", pts: 42 },
  { pos: 15, team: "Leeds", pts: 36 },
  { pos: 16, team: "Nott'm Forest", pts: 33 },
  { pos: 17, team: "West Ham", pts: 32 },
  { pos: 18, team: "Spurs", pts: 30 },
  { pos: 19, team: "Burnley", pts: 20 },
  { pos: 20, team: "Wolves", pts: 17 },
];

const relegationProbs = [
  { team: "Wolves", pct: 100.0, color: "bg-red-600" },
  { team: "Burnley", pct: 99.84, color: "bg-red-600" },
  { team: "Spurs", pct: 54.74, color: "bg-red-500" },
  { team: "West Ham", pct: 25.29, color: "bg-orange-500" },
  { team: "Nott'm Forest", pct: 15.98, color: "bg-amber-500" },
  { team: "Leeds", pct: 4.14, color: "bg-yellow-500" },
];

const relegationCombos = [
  { teams: "Burnley + Spurs + Wolves", pct: 54.52 },
  { teams: "Burnley + West Ham + Wolves", pct: 25.33 },
  { teams: "Burnley + Nott'm Forest + Wolves", pct: 15.83 },
  { teams: "Burnley + Leeds + Wolves", pct: 4.14 },
  { teams: "Spurs + West Ham + Wolves", pct: 0.07 },
  { teams: "Nott'm Forest + Spurs + Wolves", pct: 0.06 },
  { teams: "Nott'm Forest + West Ham + Wolves", pct: 0.02 },
];

const expectedPoints = [
  { team: "Leeds", avg: 44.3, p5: 39, p25: 42, median: 44, p75: 46, p95: 49 },
  { team: "Nott'm Forest", avg: 41.2, p5: 36, p25: 39, median: 41, p75: 43, p95: 46 },
  { team: "West Ham", avg: 40.3, p5: 35, p25: 38, median: 40, p75: 42, p95: 45 },
  { team: "Spurs", avg: 38.2, p5: 33, p25: 36, median: 38, p75: 40, p95: 43 },
  { team: "Burnley", avg: 28.3, p5: 23, p25: 26, median: 28, p75: 30, p95: 33 },
  { team: "Wolves", avg: 25.2, p5: 20, p25: 23, median: 25, p75: 27, p95: 30 },
];

type Fixture = {
  round: number;
  home: string;
  away: string;
  isB7: boolean;
};

const remainingFixtures: Record<string, { pts: number; fixtures: Fixture[] }> = {
  Leeds: {
    pts: 36,
    fixtures: [
      { round: 33, home: "Leeds", away: "Wolves", isB7: true },
      { round: 34, home: "Bournemouth", away: "Leeds", isB7: false },
      { round: 35, home: "Leeds", away: "Burnley", isB7: true },
      { round: 36, home: "Spurs", away: "Leeds", isB7: true },
      { round: 37, home: "Leeds", away: "Brighton", isB7: false },
      { round: 38, home: "West Ham", away: "Leeds", isB7: true },
    ],
  },
  "Nott'm Forest": {
    pts: 33,
    fixtures: [
      { round: 33, home: "Nott'm Forest", away: "Burnley", isB7: true },
      { round: 34, home: "Sunderland", away: "Nott'm Forest", isB7: false },
      { round: 35, home: "Chelsea", away: "Nott'm Forest", isB7: false },
      { round: 36, home: "Nott'm Forest", away: "Newcastle", isB7: false },
      { round: 37, home: "Man Utd", away: "Nott'm Forest", isB7: false },
      { round: 38, home: "Nott'm Forest", away: "Bournemouth", isB7: false },
    ],
  },
  "West Ham": {
    pts: 32,
    fixtures: [
      { round: 33, home: "Crystal Palace", away: "West Ham", isB7: false },
      { round: 34, home: "West Ham", away: "Everton", isB7: false },
      { round: 35, home: "Brentford", away: "West Ham", isB7: false },
      { round: 36, home: "West Ham", away: "Arsenal", isB7: false },
      { round: 37, home: "Newcastle", away: "West Ham", isB7: false },
      { round: 38, home: "West Ham", away: "Leeds", isB7: true },
    ],
  },
  Spurs: {
    pts: 30,
    fixtures: [
      { round: 33, home: "Spurs", away: "Brighton", isB7: false },
      { round: 34, home: "Wolves", away: "Spurs", isB7: true },
      { round: 35, home: "Aston Villa", away: "Spurs", isB7: false },
      { round: 36, home: "Spurs", away: "Leeds", isB7: true },
      { round: 37, home: "Chelsea", away: "Spurs", isB7: false },
      { round: 38, home: "Spurs", away: "Everton", isB7: false },
    ],
  },
  Burnley: {
    pts: 20,
    fixtures: [
      { round: 33, home: "Nott'm Forest", away: "Burnley", isB7: true },
      { round: 34, home: "Burnley", away: "Man City", isB7: false },
      { round: 35, home: "Leeds", away: "Burnley", isB7: true },
      { round: 36, home: "Burnley", away: "Aston Villa", isB7: false },
      { round: 37, home: "Arsenal", away: "Burnley", isB7: false },
      { round: 38, home: "Burnley", away: "Wolves", isB7: true },
    ],
  },
  Wolves: {
    pts: 17,
    fixtures: [
      { round: 33, home: "Leeds", away: "Wolves", isB7: true },
      { round: 34, home: "Wolves", away: "Spurs", isB7: true },
      { round: 35, home: "Wolves", away: "Sunderland", isB7: false },
      { round: 36, home: "Brighton", away: "Wolves", isB7: false },
      { round: 37, home: "Wolves", away: "Fulham", isB7: false },
      { round: 38, home: "Burnley", away: "Wolves", isB7: true },
    ],
  },
};

const h2hGames = [
  { round: 33, home: "Leeds", away: "Wolves" },
  { round: 33, home: "Nott'm Forest", away: "Burnley" },
  { round: 34, home: "Wolves", away: "Spurs" },
  { round: 35, home: "Leeds", away: "Burnley" },
  { round: 36, home: "Spurs", away: "Leeds" },
  { round: 38, home: "Burnley", away: "Wolves" },
  { round: 38, home: "West Ham", away: "Leeds" },
];

const safetyInfo = [
  { team: "Leeds", pts: 36, gamesLeft: 6, needed: 4, winsNeeded: 1, drawsNeeded: 1 },
  { team: "Nott'm Forest", pts: 33, gamesLeft: 6, needed: 7, winsNeeded: 2, drawsNeeded: 1 },
  { team: "West Ham", pts: 32, gamesLeft: 6, needed: 8, winsNeeded: 2, drawsNeeded: 2 },
  { team: "Spurs", pts: 30, gamesLeft: 6, needed: 10, winsNeeded: 3, drawsNeeded: 1 },
  { team: "Burnley", pts: 20, gamesLeft: 6, needed: 20, winsNeeded: 6, drawsNeeded: 2 },
  { team: "Wolves", pts: 17, gamesLeft: 6, needed: 23, winsNeeded: 7, drawsNeeded: 2 },
];

const navItems = [
  { id: "verdict", label: "Verdict" },
  { id: "standings", label: "Standings" },
  { id: "probability", label: "Probability" },
  { id: "trios", label: "Trios" },
  { id: "points", label: "Points" },
  { id: "survival", label: "Survival" },
  { id: "h2h", label: "H2H" },
  { id: "fixtures", label: "Fixtures" },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 120) {
          current = section.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0f1a]/95 backdrop-blur-md border-b border-blue-900/40 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeId === item.id
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-blue-900/30"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white border-b border-blue-900/50 pb-3">
      {children}
    </h2>
  );
}

function Badge({ children, variant }: { children: React.ReactNode; variant: "danger" | "warning" | "safe" | "neutral" }) {
  const colors = {
    danger: "bg-red-900/60 text-red-300 border-red-700",
    warning: "bg-amber-900/60 text-amber-300 border-amber-700",
    safe: "bg-green-900/60 text-green-300 border-green-700",
    neutral: "bg-blue-950/60 text-slate-300 border-blue-800/40",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${colors[variant]}`}>
      {children}
    </span>
  );
}

function getTeamVariant(team: string): "danger" | "warning" | "safe" | "neutral" {
  if (["Wolves", "Burnley", "Spurs"].includes(team)) return "danger";
  if (["West Ham", "Nott'm Forest"].includes(team)) return "warning";
  if (["Leeds"].includes(team)) return "safe";
  return "neutral";
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "PL Relegation Tracker 2025/26 - Who's Going Down?";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/40 rounded-full px-4 py-1.5 text-sm text-slate-300 hover:bg-blue-900/40 hover:text-amber-300 transition-colors cursor-pointer"
      title="Share this page"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <NavBar />
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0c2240] via-[#102a4a] to-[#0a1628] py-16 sm:py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Premier League 2025/26
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Relegation Tracker
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-6">
            Matchday 32 &middot; 200,000-run Monte Carlo simulation of every remaining fixture to model who&apos;s going down.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm mb-5">
            <span className="bg-blue-950/60 border border-blue-800/40 rounded-full px-4 py-1.5 text-slate-300">
              6 games remaining per team
            </span>
            <span className="bg-blue-950/60 border border-blue-800/40 rounded-full px-4 py-1.5 text-slate-300">
              7 head-to-head clashes still to play
            </span>
            <span className="bg-blue-950/60 border border-blue-800/40 rounded-full px-4 py-1.5 text-slate-300">
              Updated 15 April 2026
            </span>
          </div>
          <ShareButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Key Verdict */}
        <section id="verdict" className="scroll-mt-16 bg-gradient-to-r from-red-950/40 to-blue-950/40 border border-red-900/50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-red-400 mb-3">The Verdict</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            <strong className="text-white">Wolves</strong> (100%) and <strong className="text-white">Burnley</strong> (99.8%) are as good as down. <strong className="text-white">Spurs</strong> are now the favourites for the final relegation spot at <strong className="text-white">54.7%</strong>, ahead of <strong className="text-white">West Ham (25.3%)</strong> and <strong className="text-white">Nott&apos;m Forest (16.0%)</strong>. Leeds have moved to relative safety at just 4.1%.
          </p>
        </section>

        {/* Current Standings */}
        <section id="standings" className="scroll-mt-16">
          <SectionHeading>Current Standings</SectionHeading>
          <div className="overflow-x-auto rounded-xl border border-blue-900/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-950/60 text-slate-400 text-left">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Team</th>
                  <th className="px-4 py-3 font-semibold text-right">Pts</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => {
                  const isBottom3 = row.pos >= 18;
                  const isBottom7 = row.pos >= 15;
                  return (
                    <tr
                      key={row.team}
                      className={`border-t border-blue-900/40 ${
                        isBottom3
                          ? "bg-red-950/30"
                          : isBottom7
                          ? "bg-amber-950/20"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 font-mono text-slate-500">
                        {row.pos}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-white">
                        {row.team}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold font-mono">
                        {row.pts}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {isBottom3 && (
                          <Badge variant="danger">RELEGATION ZONE</Badge>
                        )}
                        {row.pos >= 15 && row.pos < 18 && (
                          <Badge variant="warning">AT RISK</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Points as of 15 April 2026 (Matchday 32). All teams have played 32 matches except Man City (31).
          </p>
        </section>

        {/* Relegation Probability */}
        <section id="probability" className="scroll-mt-16">
          <SectionHeading>Relegation Probability</SectionHeading>
          <p className="text-slate-400 mb-6 -mt-3">
            Based on 200,000 Monte Carlo simulations using baseline home/draw/away probabilities (45%/25%/30%).
          </p>
          <div className="space-y-4">
            {relegationProbs.map((row) => (
              <div key={row.team} className="flex items-center gap-4">
                <div className="w-36 sm:w-44 text-right font-semibold text-sm text-white shrink-0">
                  {row.team}
                </div>
                <div className="flex-1 bg-blue-950/40 rounded-full h-8 relative overflow-hidden">
                  <div
                    className={`${row.color} h-full rounded-full transition-all duration-700 flex items-center justify-end pr-3`}
                    style={{ width: `${Math.max(row.pct, 1.5)}%` }}
                  >
                    {row.pct >= 10 && (
                      <span className="text-xs font-bold text-white/90">
                        {row.pct}%
                      </span>
                    )}
                  </div>
                  {row.pct < 10 && (
                    <span className="absolute left-[calc(max(1.5%,var(--w))+8px)] top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
                      style={{ "--w": `${row.pct}%` } as React.CSSProperties}
                    >
                      {row.pct}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Most Likely Relegated Combos */}
        <section id="trios" className="scroll-mt-16">
          <SectionHeading>Most Likely Relegated Trios</SectionHeading>
          <p className="text-slate-400 mb-6 -mt-3">
            The top 4 combinations account for <strong className="text-white">99.8%</strong> of all outcomes.
          </p>
          <div className="grid gap-3">
            {relegationCombos.slice(0, 4).map((combo, i) => (
              <div
                key={combo.teams}
                className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  i === 0
                    ? "border-red-800/60 bg-red-950/30"
                    : "border-blue-900/30 bg-blue-950/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-slate-600 font-mono w-8">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-white text-base">
                    {combo.teams}
                  </span>
                </div>
                <span
                  className={`text-xl font-bold font-mono ${
                    i === 0 ? "text-red-400" : "text-slate-300"
                  }`}
                >
                  {combo.pct}%
                </span>
              </div>
            ))}
          </div>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-slate-500 hover:text-slate-300 transition-colors">
              Show less likely combinations...
            </summary>
            <div className="mt-3 space-y-2">
              {relegationCombos.slice(4).map((combo) => (
                <div
                  key={combo.teams}
                  className="flex justify-between items-center border border-blue-900/30 rounded-lg px-4 py-2 bg-blue-950/20"
                >
                  <span className="text-slate-400">{combo.teams}</span>
                  <span className="font-mono text-slate-500">{combo.pct}%</span>
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* Expected Final Points */}
        <section id="points" className="scroll-mt-16">
          <SectionHeading>Expected Final Points Distribution</SectionHeading>
          <p className="text-slate-400 mb-6 -mt-3">
            Projected point totals from simulation. The projected survival line this season is around 40 points.
          </p>
          <div className="overflow-x-auto rounded-xl border border-blue-900/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-950/60 text-slate-400 text-left">
                  <th className="px-4 py-3 font-semibold">Team</th>
                  <th className="px-4 py-3 font-semibold text-center">Worst (5%)</th>
                  <th className="px-4 py-3 font-semibold text-center">25th</th>
                  <th className="px-4 py-3 font-semibold text-center">Median</th>
                  <th className="px-4 py-3 font-semibold text-center">75th</th>
                  <th className="px-4 py-3 font-semibold text-center">Best (95%)</th>
                  <th className="px-4 py-3 font-semibold text-center">Average</th>
                </tr>
              </thead>
              <tbody>
                {expectedPoints.map((row) => {
                  const variant = getTeamVariant(row.team);
                  return (
                    <tr key={row.team} className="border-t border-blue-900/40">
                      <td className="px-4 py-2.5 font-medium text-white">
                        <span className="flex items-center gap-2">
                          {row.team}
                          <Badge variant={variant}>
                            {variant === "danger" ? "DOWN" : variant === "warning" ? "AT RISK" : variant === "safe" ? "SAFE" : "OK"}
                          </Badge>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-500">{row.p5}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-400">{row.p25}</td>
                      <td className="px-4 py-2.5 text-center font-mono font-bold text-white">{row.median}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-400">{row.p75}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-500">{row.p95}</td>
                      <td className="px-4 py-2.5 text-center font-mono font-semibold text-amber-400">{row.avg}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <div className="w-px h-4 bg-amber-600"></div>
            <span>Projected survival line: ~40 points</span>
          </div>
        </section>

        {/* Safety Threshold */}
        <section id="survival" className="scroll-mt-16">
          <SectionHeading>What Each Team Needs to Survive</SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {safetyInfo.map((row) => {
              const variant = getTeamVariant(row.team);
              const pctNeeded =
                row.gamesLeft > 0
                  ? Math.round((row.needed / (row.gamesLeft * 3)) * 100)
                  : 0;
              return (
                <div
                  key={row.team}
                  className={`rounded-xl border p-5 ${
                    variant === "danger"
                      ? "border-red-900/60 bg-red-950/20"
                      : variant === "warning"
                      ? "border-amber-900/60 bg-amber-950/20"
                      : variant === "safe"
                      ? "border-green-900/60 bg-green-950/20"
                      : "border-blue-900/30 bg-blue-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-lg">{row.team}</h3>
                    <span className="font-mono text-sm text-slate-400">
                      {row.pts} pts
                    </span>
                  </div>
                  {row.needed === 0 ? (
                    <p className="text-green-400 font-semibold">
                      Already above survival line
                    </p>
                  ) : (
                    <>
                      <p className="text-slate-300 mb-2">
                        Need <strong className="text-white">{row.needed} pts</strong> from{" "}
                        {row.gamesLeft} games to reach 40
                      </p>
                      <p className="text-slate-400 text-sm">
                        ={" "}
                        {row.winsNeeded > 0 && row.drawsNeeded > 0
                          ? `${row.winsNeeded} win${row.winsNeeded !== 1 ? "s" : ""} + ${row.drawsNeeded} draw${row.drawsNeeded !== 1 ? "s" : ""} minimum`
                          : row.winsNeeded > 0
                          ? `${row.winsNeeded} win${row.winsNeeded !== 1 ? "s" : ""} minimum`
                          : `${row.drawsNeeded} draw${row.drawsNeeded !== 1 ? "s" : ""} minimum`}
                        <span className="text-slate-600 ml-1">
                          ({pctNeeded}% of available points)
                        </span>
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Head to Head */}
        <section id="h2h" className="scroll-mt-16">
          <SectionHeading>Head-to-Head: Bottom 6 vs Bottom 6</SectionHeading>
          <p className="text-slate-400 mb-6 -mt-3">
            These 7 remaining games between the bottom 6 are the key battlegrounds. Every point matters doubly when it&apos;s taken directly from a rival.
          </p>
          <div className="overflow-x-auto rounded-xl border border-blue-900/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-950/60 text-slate-400 text-left">
                  <th className="px-4 py-3 font-semibold">Round</th>
                  <th className="px-4 py-3 font-semibold">Home</th>
                  <th className="px-4 py-3 font-semibold text-center">vs</th>
                  <th className="px-4 py-3 font-semibold text-right">Away</th>
                </tr>
              </thead>
              <tbody>
                {h2hGames.map((game, i) => (
                  <tr key={i} className="border-t border-blue-900/40 hover:bg-blue-900/20 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-amber-400">R{game.round}</td>
                    <td className="px-4 py-2.5 font-medium text-white">{game.home}</td>
                    <td className="px-4 py-2.5 text-center text-slate-600">vs</td>
                    <td className="px-4 py-2.5 text-right font-medium text-white">{game.away}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Remaining Fixtures per Team */}
        <section id="fixtures" className="scroll-mt-16">
          <SectionHeading>Remaining Fixtures by Team</SectionHeading>
          <div className="grid gap-6">
            {Object.entries(remainingFixtures).map(([team, data]) => {
              const variant = getTeamVariant(team);
              return (
                <div
                  key={team}
                  className="rounded-xl border border-blue-900/30 bg-blue-950/20 overflow-hidden"
                >
                  <div className={`px-5 py-3 flex items-center justify-between ${
                    variant === "danger"
                      ? "bg-red-950/40 border-b border-red-900/40"
                      : variant === "warning"
                      ? "bg-amber-950/30 border-b border-amber-900/40"
                      : variant === "safe"
                      ? "bg-green-950/30 border-b border-green-900/40"
                      : "bg-blue-950/40 border-b border-blue-800/30"
                  }`}>
                    <h3 className="font-bold text-white text-lg">{team}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-mono text-slate-400">{data.pts} pts</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">{data.fixtures.length} games left</span>
                    </div>
                  </div>
                  <div className="divide-y divide-blue-900/40">
                    {data.fixtures.map((f, i) => {
                      const isHome = f.home === team;
                      const opponent = isHome ? f.away : f.home;
                      return (
                        <div
                          key={i}
                          className="px-5 py-2.5 flex items-center justify-between text-sm hover:bg-blue-900/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-500 w-8">R{f.round}</span>
                            <span className={`text-xs font-semibold w-14 ${isHome ? "text-blue-400" : "text-slate-500"}`}>
                              {isHome ? "HOME" : "AWAY"}
                            </span>
                            <span className="text-white">vs {opponent}</span>
                          </div>
                          {f.isB7 && (
                            <Badge variant="warning">RIVAL</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-blue-950/30 border border-blue-900/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-3">Methodology</h2>
          <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
            <li>200,000 Monte Carlo simulations of all remaining Premier League fixtures.</li>
            <li>Baseline outcome probabilities: Home Win 45%, Draw 25%, Away Win 30%.</li>
            <li>All 20 teams simulated &mdash; not just the bottom 6 &mdash; to account for the full table context.</li>
            <li>Points as of 15 April 2026 (Matchday 32). All teams on 32 matches played except Man City (31).</li>
            <li>This model uses uniform probabilities and does not weight by form, xG, or squad quality. Actual relegation odds from bookmakers may differ.</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-blue-900/30 py-8 text-center text-sm text-slate-600">
        Premier League Relegation Tracker 2025/26 &middot; Data analysis performed 15 April 2026
      </footer>
    </div>
  );
}
