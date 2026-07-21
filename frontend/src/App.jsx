import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Bookcase from "./pages/Bookcase.jsx";
import Search from "./pages/Search.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import Stats from "./pages/Stats.jsx";

function Protected({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading-state">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/bookcase"
        element={
          <Protected>
            <Bookcase />
          </Protected>
        }
      />
      <Route
        path="/search"
        element={
          <Protected>
            <Search />
          </Protected>
        }
      />
      <Route
        path="/book/:id"
        element={
          <Protected>
            <BookDetail />
          </Protected>
        }
      />
      <Route
        path="/stats"
        element={
          <Protected>
            <Stats />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
