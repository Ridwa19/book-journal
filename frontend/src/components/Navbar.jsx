import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="brand">
        Book<span>Journal</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/bookcase" className={({ isActive }) => (isActive ? "active" : "")}>
          MyBookcase
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
          Book Search
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => (isActive ? "active" : "")}>
          Personal Stats
        </NavLink>
      </div>
      <div className="nav-user">
        <span>{user?.name}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
