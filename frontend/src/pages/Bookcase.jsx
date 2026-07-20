import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const SHELVES = ["All", "Reading Now", "Finished", "Wishlist", "Abandoned"];

export default function Bookcase() {
  const { token } = useAuth();
  const [shelf, setShelf] = useState("All");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getBooks(token, shelf === "All" ? undefined : shelf)
      .then((data) => setBooks(data.books))
      .finally(() => setLoading(false));
  }, [token, shelf]);

  async function handleShelfChange(bookId, newShelf) {
    const updates = { shelf: newShelf };
    if (newShelf === "Finished") updates.finishedAt = new Date().toISOString();
    if (newShelf === "Reading Now") updates.startedAt = new Date().toISOString();
    const { book } = await api.updateBook(token, bookId, updates);
    setBooks((prev) =>
      shelf === "All" || shelf === newShelf
        ? prev.map((b) => (b._id === bookId ? book : b))
        : prev.filter((b) => b._id !== bookId)
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>MyBookcase</h1>
        <p>Every book you've searched for and shelved, all in one place.</p>
      </div>

      <div className="tab-row">
        {SHELVES.map((s) => (
          <button
            key={s}
            className={`tab ${shelf === s ? "active" : ""}`}
            onClick={() => setShelf(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading your shelf...</div>
      ) : books.length === 0 ? (
        <div className="empty-state card">
          <h3>Nothing on this shelf yet</h3>
          <p>Search for a book and add it here.</p>
          <Link to="/search" className="btn btn-primary" style={{ display: "inline-block", marginTop: 14 }}>
            Find a book
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((b) => (
            <div className="book-card" key={b._id}>
              <Link to={`/book/${b._id}`}>
                {b.coverUrl ? (
                  <img className="book-cover" src={b.coverUrl} alt={b.title} />
                ) : (
                  <div className="book-cover-placeholder">{b.title}</div>
                )}
              </Link>
              <div className="book-info">
                <Link to={`/book/${b._id}`}>
                  <div className="title">{b.title}</div>
                </Link>
                <div className="author">{b.author}</div>
                <select
                  className="shelf-select"
                  value={b.shelf}
                  onChange={(e) => handleShelfChange(b._id, e.target.value)}
                >
                  {SHELVES.filter((s) => s !== "All").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
