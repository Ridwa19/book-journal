import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const CHART_COLORS = ["#E76F51", "#2A9D8F", "#E9C46A", "#264653", "#F4A261", "#8AB17D"];

function formatRelativeTime(value) {
  if (!value) return "Recently";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function initials(name) {
  if (!name) return "BJ";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    Promise.all([api.getOverview(token), api.getHistory(token), api.getBooks(token)])
      .then(([overviewData, historyData, booksData]) => {
        if (!active) return;
        setOverview(overviewData);
        setHistory(historyData);
        setBooks(booksData.books || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (loading) return <div className="loading-state">Loading your dashboard...</div>;

  if (error) {
    return (
      <div className="page">
        <div className="empty-state card">
          <h3>Dashboard unavailable</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const shelfCounts = overview?.shelfCounts || { Wishlist: 0, "Reading Now": 0, Finished: 0, Abandoned: 0 };
  const shelfChartData = Object.entries(shelfCounts).map(([name, value]) => ({ name, value }));
  const yearHistory = history?.byYear || {};
  const yearChartData = Object.entries(yearHistory).map(([year, value]) => ({ year, value }));
  const genreEntries = Object.entries(history?.byGenre || {}).sort((a, b) => b[1] - a[1]);
  const genreChartData = genreEntries.map(([name, value], index) => ({
    name,
    value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const totalBooks = overview?.totalBooks || 0;
  const finishedThisYear = overview?.finishedThisYear || 0;
  const readingGoal = overview?.readingGoal || 0;
  const goalProgress = readingGoal ? Math.min(100, Math.round((finishedThisYear / readingGoal) * 100)) : 0;

  const recentBooks = [...books]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 3);
  const currentReading = books.find((book) => book.shelf === "Reading Now") || null;

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <button className="menu-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          <div className="search-container">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </span>
            <input type="text" placeholder="Search books, authors, ISBN, genre..." disabled />
            <span className="search-shortcut">⌘K</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button className="notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge"></span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">{initials(user?.name)}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || "Reader"}</div>
              <div className="user-title">{user?.readingGoal ? `${user.readingGoal} books/year goal` : "Reading dashboard"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="stats-row">
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(233, 30, 99, 0.2)", color: "#E91E63" }}>📚</div>
            <div className="value">{totalBooks}</div>
            <div className="label">Wadarta Buugaagta</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(76, 175, 80, 0.2)", color: "#4CAF50" }}>✅</div>
            <div className="value">{shelfCounts.Finished || 0}</div>
            <div className="label">La Dhammaystay</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(156, 39, 176, 0.2)", color: "#9C27B0" }}>📖</div>
            <div className="value">{shelfCounts["Reading Now"] || 0}</div>
            <div className="label">Hadda Akhrinaya</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(255, 152, 0, 0.2)", color: "#FF9800" }}>⭐</div>
            <div className="value">{shelfCounts.Wishlist || 0}</div>
            <div className="label">La Akhrin Doono</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(244, 67, 54, 0.2)", color: "#F44336" }}>🔥</div>
            <div className="value">{finishedThisYear}</div>
            <div className="label">Finished this year</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(33, 150, 243, 0.2)", color: "#2196F3" }}>📄</div>
            <div className="value">{readingGoal ? `${goalProgress}%` : "0%"}</div>
            <div className="label">Goal progress</div>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <h3>Books by shelf</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={shelfChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#E91E63" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Books finished by year</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={yearChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="value" stroke="#9C27B0" strokeWidth={2} dot={{ fill: "#9C27B0" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Top genres</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={genreChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {genreChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", justifyContent: "center" }}>
              {genreChartData.length > 0 ? (
                genreChartData.map((item) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }}></div>
                    <span style={{ color: "#A0A0A0" }}>{item.name} {item.value}</span>
                  </div>
                ))
              ) : (
                <span style={{ color: "#A0A0A0", fontSize: 12 }}>No finished books yet.</span>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", margin: 0, color: "var(--text-primary)" }}>
              Reading goal progress
            </h3>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {finishedThisYear} / {readingGoal || 0} books
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${goalProgress}%` }}></div>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
            {goalProgress}% complete
          </div>
        </div>

        <div className="bottom-row">
          <div className="activity-card">
            <h3>Recent activity</h3>
            {recentBooks.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Add a book to see your latest activity here.</p>
            ) : (
              recentBooks.map((book) => (
                <div key={book._id} className="activity-item">
                  <div className="activity-icon">{book.shelf === "Finished" ? "✅" : "📖"}</div>
                  <div className="activity-details">
                    <div className="activity-title">{book.title}</div>
                    <div className="activity-meta">
                      {book.shelf} • {book.pageCount || 0} pages • {formatRelativeTime(book.updatedAt || book.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="currently-reading-card">
            <h3>Currently reading</h3>
            {currentReading ? (
              <div className="book-preview">
                <div className="book-preview-cover">
                  {currentReading.coverUrl ? (
                    <img src={currentReading.coverUrl} alt={currentReading.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>📖</div>
                      {currentReading.title}
                    </div>
                  )}
                </div>
                <div>
                  <div className="book-preview-title">{currentReading.title}</div>
                  <div className="book-preview-author">{currentReading.author}</div>
                  <div className="book-preview-rating">
                    {"★".repeat(Math.max(0, currentReading.rating || 0))}
                    <span style={{ color: "var(--border)" }}>{"★".repeat(Math.max(0, 5 - (currentReading.rating || 0)))}</span>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "4px" }}>{currentReading.rating || 0}/5</span>
                  </div>
                </div>
                <div className="book-preview-progress">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <span>Status</span>
                    <span>{currentReading.shelf}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${currentReading.pageCount ? Math.min(100, Math.max(10, Math.round((currentReading.rating || 0) * 20))) : 10}%` }}></div>
                  </div>
                  <div className="book-preview-pages">{currentReading.pageCount || 0} pages logged</div>
                </div>
                <Link className="continue-btn" to={`/book/${currentReading._id}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  Open book
                </Link>
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Move a book to Reading Now to feature it here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
