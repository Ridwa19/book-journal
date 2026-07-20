import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ICONS = {
  reading: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5C4.67 20 4 19.33 4 18.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M20 5.5C20 4.67 19.33 4 18.5 4H13v16h5.5c.83 0 1.5-.67 1.5-1.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  finished: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wishlist: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 20s-7.5-4.8-10-9.4C.5 6.8 2.7 4 6 4c2 0 3.7 1.1 4.5 2.6l1.5 2.7 1.5-2.7C14.3 5.1 16 4 18 4c3.3 0 5.5 2.8 4 6.6C19.5 15.2 12 20 12 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  total: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="1.6" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 3v18M8 8h8M8 13h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

function ProgressRing({ pct, size = 108 }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--terracotta)"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontSize="22"
        fill="var(--ink)"
      >
        {pct}%
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOverview(token), api.getBooks(token), api.getBooks(token, "Reading Now")])
      .then(([ov, books, reading]) => {
        setOverview(ov);
        setRecentBooks(books.books.slice(0, 6));
        setCurrentlyReading(reading.books.slice(0, 1));
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading-state">Loading your dashboard...</div>;

  const pct = overview.readingGoal
    ? Math.min(100, Math.round((overview.finishedThisYear / overview.readingGoal) * 100))
    : 0;
  const spotlight = currentlyReading[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      {/* Hero */}
      <div className="dash-hero">
        <div>
          <p className="dash-eyebrow">{greeting}</p>
          <h1 className="dash-title">
            {user?.name?.split(" ")[0]}'s <span>reading life</span>
          </h1>
          <p className="dash-sub">
            {overview.finishedThisYear === 0
              ? "No books finished yet this year — let's change that."
              : `You've finished ${overview.finishedThisYear} book${overview.finishedThisYear === 1 ? "" : "s"} so far this year.`}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Link to="/search" className="btn btn-primary">Find a book</Link>
            <Link to="/bookcase" className="btn btn-ghost">Open bookcase</Link>
          </div>
        </div>
        <div className="dash-ring-card">
          <ProgressRing pct={pct} />
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {overview.finishedThisYear} / {overview.readingGoal}
            </div>
            <div className="stat-label" style={{ marginTop: 2 }}>reading goal</div>
          </div>
        </div>
      </div>

      {/* Spotlight: currently reading */}
      {spotlight && (
        <Link to={`/book/${spotlight._id}`} className="spotlight-card">
          {spotlight.coverUrl ? (
            <img src={spotlight.coverUrl} alt={spotlight.title} className="spotlight-cover" />
          ) : (
            <div className="book-cover-placeholder spotlight-cover">{spotlight.title}</div>
          )}
          <div>
            <div className="stat-label">Currently reading</div>
            <div className="spotlight-title">{spotlight.title}</div>
            <div className="spotlight-author">{spotlight.author}</div>
            <span className="spotlight-cta">Continue journaling →</span>
          </div>
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-4 dash-stats">
        <div className="card stat-card">
          <div className="stat-icon">{ICONS.reading}</div>
          <div>
            <div className="stat-value">{overview.shelfCounts["Reading Now"]}</div>
            <div className="stat-label">Reading now</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ color: "var(--green)" }}>{ICONS.finished}</div>
          <div>
            <div className="stat-value" style={{ color: "var(--green)" }}>{overview.shelfCounts["Finished"]}</div>
            <div className="stat-label">Finished</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">{ICONS.wishlist}</div>
          <div>
            <div className="stat-value">{overview.shelfCounts["Wishlist"]}</div>
            <div className="stat-label">Wishlist</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">{ICONS.total}</div>
          <div>
            <div className="stat-value">{overview.totalBooks}</div>
            <div className="stat-label">Total in bookcase</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, marginTop: 8 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: 0 }}>
          Recently added
        </h2>
        <Link to="/bookcase" style={{ fontSize: 13, color: "var(--terracotta)", fontWeight: 600 }}>
          View bookcase →
        </Link>
      </div>

      {recentBooks.length === 0 ? (
        <div className="empty-state card">
          <h3>Your bookcase is empty</h3>
          <p>Search for a book to add your first entry.</p>
          <Link to="/search" className="btn btn-primary" style={{ display: "inline-block", marginTop: 14 }}>
            Find a book
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {recentBooks.map((b) => (
            <Link to={`/book/${b._id}`} key={b._id} className="book-card">
              {b.coverUrl ? (
                <img className="book-cover" src={b.coverUrl} alt={b.title} />
              ) : (
                <div className="book-cover-placeholder">{b.title}</div>
              )}
              <div className="book-info">
                <div className="title">{b.title}</div>
                <div className="author">{b.author}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
