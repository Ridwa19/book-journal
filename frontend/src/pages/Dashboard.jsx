import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", books: 4 },
  { month: "Feb", books: 6 },
  { month: "Mar", books: 3 },
  { month: "Apr", books: 5 },
  { month: "May", books: 4 },
  { month: "Jun", books: 7 },
  { month: "Jul", books: 2 },
];

const dailyData = [
  { day: "Jun 28", pages: 45 },
  { day: "Jun 29", pages: 32 },
  { day: "Jun 30", pages: 58 },
  { day: "Jul 1", pages: 41 },
  { day: "Jul 2", pages: 67 },
  { day: "Jul 3", pages: 23 },
  { day: "Jul 4", pages: 55 },
];

const genreData = [
  { name: "Romance", value: 35, color: "#E91E63" },
  { name: "Action", value: 20, color: "#9C27B0" },
  { name: "Horror", value: 15, color: "#4CAF50" },
  { name: "Adventure", value: 10, color: "#FF9800" },
  { name: "Fantasy", value: 10, color: "#2196F3" },
  { name: "Other", value: 10, color: "#607D8B" },
];

const recentActivity = [
  { title: "Qalbiga Iyo Nafteyda", pages: 120, time: "2 hours ago", icon: "📖" },
  { title: "Jacaylka Aan Raadinayey", pages: 45, time: "Yesterday", icon: "📖" },
  { title: "Xusuustii Aan Ilaawein", pages: null, time: "2 days ago", icon: "✅", completed: true },
];

const weeklyStreak = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: true },
  { day: "Thu", completed: true },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: false },
];

const calendarData = Array.from({ length: 35 }, (_, i) => ({
  day: i + 1,
  activity: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0,
}));

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <button className="menu-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="search-container">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search books, authors, ISBN, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-shortcut">⌘K</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button className="notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="notification-badge"></span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">ER</div>
            <div className="user-info">
              <div className="user-name">E-Ridwan</div>
              <div className="user-title">Book Lover</div>
            </div>
          </div>
          <div className="date-picker">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Sabti, 4 Jul 2025
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(233, 30, 99, 0.2)", color: "#E91E63" }}>📚</div>
            <div className="value">48</div>
            <div className="label">Wadarta Buugaagta</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(76, 175, 80, 0.2)", color: "#4CAF50" }}>✅</div>
            <div className="value">16</div>
            <div className="label">La Dhammaystay</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(156, 39, 176, 0.2)", color: "#9C27B0" }}>📖</div>
            <div className="value">5</div>
            <div className="label">Hadda Akhrinaya</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(255, 152, 0, 0.2)", color: "#FF9800" }}>⭐</div>
            <div className="value">27</div>
            <div className="label">La Akhrin Doono</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(244, 67, 54, 0.2)", color: "#F44336" }}>🔥</div>
            <div className="value">12</div>
            <div className="label">Streak</div>
          </div>
          <div className="stat-card-mini">
            <div className="icon" style={{ background: "rgba(33, 150, 243, 0.2)", color: "#2196F3" }}>📄</div>
            <div className="value">3,245</div>
            <div className="label">Bogagga La Akhriyey</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Buugaagta Bishii</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="books" fill="#E91E63" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Bogagga Maalin Kasta</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="pages" stroke="#9C27B0" strokeWidth={2} dot={{ fill: "#9C27B0" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Noocyada Buugaagta</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", justifyContent: "center" }}>
              {genreData.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }}></div>
                  <span style={{ color: "#A0A0A0" }}>{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Goal Progress */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", margin: 0, color: "var(--text-primary)" }}>
              Hadafka Akhriska Bishan
            </h3>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>3,920 / 5,000 bog</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: "78%" }}></div>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>78% complete</div>
        </div>

        {/* Reading Streak */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", margin: 0, color: "var(--text-primary)" }}>
              Reading Streak
            </h3>
            <span style={{ fontSize: "14px", color: "var(--accent-orange)", fontWeight: "600" }}>🔥 12 days</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
            {weeklyStreak.map((day) => (
              <div
                key={day.day}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  background: day.completed ? "rgba(76, 175, 80, 0.2)" : "var(--bg-card-light)",
                  border: day.completed ? "1px solid #4CAF50" : "1px solid var(--border)",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: day.completed ? "#4CAF50" : "var(--text-secondary)",
                }}
              >
                {day.day}
                <div style={{ marginTop: "4px", fontSize: "16px" }}>{day.completed ? "✓" : "○"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", margin: "0 0 16px 0", color: "var(--text-primary)" }}>
            Reading Calendar - July 2025
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ textAlign: "center", fontSize: "11px", color: "var(--text-secondary)", padding: "4px" }}>
                {day}
              </div>
            ))}
            {calendarData.map((item) => (
              <div
                key={item.day}
                style={{
                  aspectRatio: "1",
                  background: item.activity === 0 ? "var(--bg-card-light)" : 
                               item.activity === 1 ? "rgba(76, 175, 80, 0.3)" :
                               item.activity === 2 ? "rgba(76, 175, 80, 0.6)" :
                               "rgba(76, 175, 80, 0.9)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  color: item.activity > 0 ? "#fff" : "var(--text-secondary)",
                }}
              >
                {item.day}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">
          {/* Recent Activity */}
          <div className="activity-card">
            <h3>Waxqabadkii Ugu Dambeeyay</h3>
            {recentActivity.map((item, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{item.icon}</div>
                <div className="activity-details">
                  <div className="activity-title">{item.title}</div>
                  <div className="activity-meta">
                    {item.completed ? "Completed" : `${item.pages} pages`} • {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Currently Reading */}
          <div className="currently-reading-card">
            <h3>Hadda Aad Akhrinayso</h3>
            <div className="book-preview">
              <div className="book-preview-cover">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📖</div>
                  Book Cover
                </div>
              </div>
              <div>
                <div className="book-preview-title">Jacaylka Aan Raadinaayey</div>
                <div className="book-preview-author">Unknown</div>
                <div className="book-preview-rating">
                  {"★".repeat(4)}<span style={{ color: "var(--border)" }}>★</span>
                  <span style={{ color: "var(--text-secondary)", marginLeft: "4px" }}>4.8</span>
                </div>
              </div>
              <div className="book-preview-progress">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span>Progress</span>
                  <span>60%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: "60%" }}></div>
                </div>
                <div className="book-preview-pages">240 / 400 bog</div>
              </div>
              <button className="continue-btn">Sii Akhri</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
