import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: "📊", label: "Dashboard", path: "/" },
  { icon: "🔍", label: "Book Search", path: "/search" },
  { icon: "📚", label: "My Books", path: "/bookcase" },
  { icon: "➕", label: "Add Book", path: "/add" },
  { icon: "📈", label: "My Stats", path: "/stats" },
  { icon: "👤", label: "Profile", path: "/profile" },
  { icon: "🏆", label: "Achievements", path: "/achievements" },
  { icon: "🎯", label: "Reading Goals", path: "/goals" },
  { icon: "📅", label: "Calendar", path: "/calendar" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
  { icon: "❓", label: "Help & Support", path: "/help" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Book<span>Journal</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-progress">
        <div className="sidebar-progress-title">Reading Goal</div>
        <div className="progress-ring">
          <svg className="progress-ring-circle" width="80" height="80">
            <circle
              className="progress-ring-bg"
              cx="40"
              cy="40"
              r="32"
            />
            <circle
              className="progress-ring-fill"
              cx="40"
              cy="40"
              r="32"
              strokeDasharray="201"
              strokeDashoffset="44"
            />
          </svg>
          <div className="progress-ring-text">78%</div>
        </div>
      </div>

      <div className="sidebar-quote">
        "A room without books is like a body without a soul."
      </div>
    </aside>
  );
}
