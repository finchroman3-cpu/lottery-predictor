"use client";

import { useState, useEffect, useCallback } from "react";
import { STATE_GAMES, STATE_LABELS, type StateCode, type GameType } from "@/lib/predictor";

interface PredictionData {
  state: string;
  game: string;
  predictions: number[][];
  hotNumbers: { number: number; count: number; percentage: number }[];
  coldNumbers: { number: number; count: number; percentage: number }[];
  topPairs: [number, number, number][];
  oddEvenPattern: string;
  totalDraws: number;
  recentDraws: { date: string; numbers: number[] }[];
  live: boolean;
  error?: string;
}

export default function Home() {
  const [state, setState] = useState<StateCode>("nj");
  const [game, setGame] = useState<GameType>("pick6");
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyPrediction = useCallback((pred: number[], i: number) => {
    navigator.clipboard.writeText(pred.join(", ")).then(() => {
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex((cur) => (cur === i ? null : cur)), 1500);
    });
  }, []);

  const fetchData = useCallback(async (s: StateCode, g: GameType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/predict?state=${s}&game=${g}`);
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }));
    } catch (e) {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(state, game);
  }, [state, game, fetchData]);

  // Auto-refresh every 6 hours
  useEffect(() => {
    const interval = setInterval(() => fetchData(state, game), 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state, game, fetchData]);

  const config = STATE_GAMES[state][game];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--gold)" }}>
          {STATE_LABELS[state]} Lottery Predictor
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Frequency-based predictions · Updated every 6 hours
        </p>
      </div>

      {/* State selector */}
      <div className="flex gap-2 justify-center mb-4">
        {(Object.keys(STATE_LABELS) as StateCode[]).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`px-6 py-2 rounded-xl transition-all text-sm ${
              state === s ? "tab-active" : ""
            }`}
            style={
              state !== s
                ? { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
                : {}
            }
          >
            {STATE_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Game selector */}
      <div className="flex gap-2 justify-center mb-8">
        {(Object.keys(STATE_GAMES[state]) as GameType[]).map((g) => (
          <button
            key={g}
            onClick={() => setGame(g)}
            className={`px-6 py-3 rounded-xl transition-all ${
              game === g ? "tab-active" : ""
            }`}
            style={
              game !== g
                ? { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
                : {}
            }
          >
            {STATE_GAMES[state][g].label}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        className="text-center text-xs mb-8 p-3 rounded-lg"
        style={{ background: "var(--card)", color: "var(--muted)", border: "1px solid var(--border)" }}
      >
        ⚠️ For entertainment only. Lottery numbers are random. This app does not guarantee wins.
        Each draw is independent — past results do not influence future ones. Play responsibly.
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>
          <div className="text-2xl mb-4">🔄 Analyzing recent draws...</div>
        </div>
      ) : data?.error ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>
          <div className="text-xl">⚠️ {data.error}</div>
        </div>
      ) : data ? (
        <>
          {/* Predictions */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--orange)" }}>
              🎯 Predictions — {config.label}
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Based on {data.totalDraws} recent draws · {config.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.predictions.map((pred, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <span className="text-sm font-bold" style={{ color: "var(--muted)" }}>
                    #{i + 1}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {pred.map((num, j) => (
                      <span
                        key={j}
                        className={`ball ${config.pickCount <= 4 ? "ball-sm" : ""} ${
                          i < 3 ? "ball-predict" : ""
                        }`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => copyPrediction(pred, i)}
                    className="ml-auto text-xs px-2 py-1 rounded-md transition-colors"
                    style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
                    aria-label="Copy these numbers"
                  >
                    {copiedIndex === i ? "✓ Copied" : "📋 Copy"}
                  </button>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {i < 3 ? "🔥 Hot" : i < 6 ? "⚖️ Balanced" : i < 8 ? "🎲 Pairs" : "🎲 Random"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Hot & Cold */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--orange)" }}>
              📊 Frequency Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hot */}
              <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-3" style={{ color: "var(--gold)" }}>🔥 Hot Numbers</h3>
                {data.hotNumbers.map((h) => (
                  <div key={h.number} className="flex items-center gap-2 mb-2">
                    <span className="font-bold w-8" style={{ color: "var(--gold)" }}>
                      {h.number}
                    </span>
                    <div
                      className="freq-bar"
                      style={{ width: `${Math.max(h.percentage * 3, 5)}%` }}
                    />
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {h.count}x
                    </span>
                  </div>
                ))}
              </div>

              {/* Cold */}
              <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-3" style={{ color: "#6a8aaa" }}>❄️ Cold Numbers</h3>
                {data.coldNumbers.map((c) => (
                  <div key={c.number} className="flex items-center gap-2 mb-2">
                    <span className="font-bold w-8" style={{ color: "#8aaaca" }}>
                      {c.number}
                    </span>
                    <div
                      className="freq-bar cold-bar"
                      style={{ width: `${Math.max(c.percentage * 3, 5)}%` }}
                    />
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {c.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Odd/Even & Pairs */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-2" style={{ color: "var(--gold)" }}>Odd/Even Pattern</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {data.oddEvenPattern}
                </p>
              </div>
              <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-2" style={{ color: "var(--gold)" }}>Top Pairs</h3>
                {data.topPairs.map(([a, b, count], i) => (
                  <div key={i} className="text-sm mb-1" style={{ color: "var(--text)" }}>
                    {a} - {b}: <span style={{ color: "var(--muted)" }}>{count}x together</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Draws */}
          {data.recentDraws && data.recentDraws.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--orange)" }}>
                📋 Recent {config.label} Draws
                {!data.live && (
                  <span
                    className="text-xs font-normal px-2 py-1 rounded-md"
                    style={{ background: "var(--card)", color: "var(--muted)", border: "1px solid var(--border)" }}
                  >
                    Static sample data — not live
                  </span>
                )}
              </h2>
              <div className="space-y-2">
                {data.recentDraws.map((draw, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <span className="text-xs w-24 shrink-0" style={{ color: "var(--muted)" }}>
                      {draw.date || (i === 0 ? "Latest" : `Draw ${i + 1}`)}
                    </span>
                    <div className="flex gap-2">
                      {draw.numbers.map((num, j) => (
                        <span key={j} className={`ball ${config.pickCount <= 4 ? "ball-sm" : ""}`}>
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="text-center text-xs mt-12 pb-8" style={{ color: "var(--muted)" }}>
            <p>Last updated: {lastUpdate} ET</p>
            <p className="mt-2">
              {data.live
                ? "Data from lotterycorner.com's results archive · Predictions based on frequency analysis"
                : `${STATE_LABELS[state]} ${config.label} uses a fixed historical sample (live scraping unavailable) · Predictions based on frequency analysis`}
            </p>
            <p className="mt-1">
              This is a fun project. Don&apos;t bet money you can&apos;t afford to lose.
            </p>
          </footer>
        </>
      ) : (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>
          <div className="text-xl mb-4">⚠️ Couldn&apos;t reach the prediction service.</div>
          <button
            onClick={() => fetchData(state, game)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            Try again
          </button>
        </div>
      )}
    </main>
  );
}
