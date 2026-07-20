import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Stats() {
  const { token } = useAuth();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory(token).then(setHistory).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading-state">Crunching your numbers...</div>;

  const years = Object.keys(history.byYear);
  const maxYearCount = Math.max(1, ...Object.values(history.byYear));
  const genres = Object.entries(history.byGenre).sort((a, b) => b[1] - a[1]);
  const maxGenreCount = Math.max(1, ...genres.map(([, c]) => c));

  const totalFinished = years.reduce((sum, y) => sum + history.byYear[y], 0);
  const fiction = history.byClassification["Fiction"] || 0;
  const nonFiction = history.byClassification["Non-Fiction"] || 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Personal Stats</h1>
        <p>Your reading, going back up to five years.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginTop: 0 }}>
          Books finished per year
        </h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 160, paddingTop: 10 }}>
          {years.map((y) => (
            <div key={y} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: `${(history.byYear[y] / maxYearCount) * 120}px`,
                  background: "var(--terracotta)",
                  borderRadius: "6px 6px 0 0",
                  minHeight: history.byYear[y] > 0 ? 4 : 0,
                }}
              />
              <div style={{ fontSize: 12, marginTop: 8, color: "var(--ink-soft)" }}>{y}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{history.byYear[y]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="stat-value">{totalFinished}</div>
          <div className="stat-label">Total finished (5 yrs)</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="stat-label">Fiction</span>
            <span className="stat-label">Non-Fiction</span>
          </div>
          <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden" }}>
            <div
              style={{
                width: `${totalFinished ? (fiction / (fiction + nonFiction || 1)) * 100 : 50}%`,
                background: "var(--terracotta)",
              }}
            />
            <div style={{ flex: 1, background: "var(--green)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 13 }}>
            <span>{fiction}</span>
            <span>{nonFiction}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginTop: 0 }}>
          Genres
        </h2>
        {genres.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
            Finish a book to see your genre breakdown here.
          </p>
        ) : (
          genres.map(([genre, count]) => (
            <div key={genre} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{genre}</span>
                <span style={{ color: "var(--ink-soft)" }}>{count}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(count / maxGenreCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
