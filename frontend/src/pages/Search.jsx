import { useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Search() {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIsbns, setAddedIsbns] = useState(new Set());
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.searchBooks(token, query);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(result, shelf) {
    await api.addBook(token, {
      title: result.title,
      author: result.author,
      coverUrl: result.coverUrl,
      isbn: result.isbn,
      pageCount: result.pageCount,
      shelf,
    });
    setAddedIsbns((prev) => new Set(prev).add(result.isbn || result.title));
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Book Search</h1>
        <p>Find your next read and add it straight to a shelf.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="auth-error">{error}</div>}

      <div className="grid grid-2">
        {results.map((r) => {
          const key = r.isbn || r.title;
          const added = addedIsbns.has(key);
          return (
            <div className="search-result" key={key}>
              {r.coverUrl ? (
                <img src={r.coverUrl} alt={r.title} />
              ) : (
                <div style={{ width: 52, height: 78, background: "var(--line)", borderRadius: 4 }} />
              )}
              <div className="meta">
                <div className="title">{r.title}</div>
                <div className="author">
                  {r.author}
                  {r.firstPublishYear ? ` · ${r.firstPublishYear}` : ""}
                </div>
                {added ? (
                  <div style={{ fontSize: 12, color: "var(--green)", marginTop: 6, fontWeight: 600 }}>
                    Added ✓
                  </div>
                ) : (
                  <select
                    className="shelf-select"
                    defaultValue=""
                    onChange={(e) => e.target.value && handleAdd(r, e.target.value)}
                  >
                    <option value="" disabled>
                      Add to shelf...
                    </option>
                    <option value="Wishlist">Wishlist</option>
                    <option value="Reading Now">Reading Now</option>
                    <option value="Finished">Finished</option>
                    <option value="Abandoned">Abandoned</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && results.length === 0 && query && !error && (
        <div className="empty-state">
          <h3>No results</h3>
          <p>Try a different title or author spelling.</p>
        </div>
      )}
    </div>
  );
}
