import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [entry, setEntry] = useState({
    characters: "",
    favoriteQuotes: "",
    plotNotes: "",
    themes: "",
    freeformNotes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    Promise.all([api.getBooks(token), api.getJournal(token, id)]).then(([books, j]) => {
      const found = books.books.find((b) => b._id === id);
      setBook(found);
      if (j.entry) setEntry(j.entry);
      setLoading(false);
    });
  }, [token, id]);

  async function handleRating(value) {
    const { book: updated } = await api.updateBook(token, id, { rating: value });
    setBook(updated);
  }

  async function handleClassification(field, value) {
    const { book: updated } = await api.updateBook(token, id, { [field]: value });
    setBook(updated);
  }

  async function handleSaveJournal() {
    setSaving(true);
    try {
      await api.saveJournal(token, id, entry);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove "${book.title}" from your bookcase?`)) return;
    await api.deleteBook(token, id);
    navigate("/bookcase");
  }

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!book) return <div className="empty-state">Book not found.</div>;

  return (
    <div className="page">
      <div className="detail-header">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div className="book-cover-placeholder">{book.title}</div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 4px" }}>
            {book.title}
          </h1>
          <p style={{ color: "var(--ink-soft)", margin: "0 0 12px" }}>{book.author}</p>

          <div className="rating-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`star ${n <= book.rating ? "filled" : ""}`}
                onClick={() => handleRating(n)}
                aria-label={`Rate ${n} stars`}
              >
                ★
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <select
              className="shelf-select"
              style={{ width: "auto" }}
              value={book.classification}
              onChange={(e) => handleClassification("classification", e.target.value)}
            >
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
            <input
              className="shelf-select"
              style={{ width: 160 }}
              value={book.genre}
              placeholder="Genre"
              onBlur={(e) => handleClassification("genre", e.target.value)}
              onChange={(e) => setBook({ ...book, genre: e.target.value })}
            />
            <button className="btn btn-ghost" onClick={handleDelete}>
              Remove book
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 0 }}>
          Journal entry
        </h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: -8 }}>
          Write as much or as little as you like — it's your journal.
        </p>

        <div className="field">
          <label>Characters</label>
          <textarea
            rows={2}
            value={entry.characters}
            onChange={(e) => setEntry({ ...entry, characters: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Favorite quotes</label>
          <textarea
            rows={2}
            value={entry.favoriteQuotes}
            onChange={(e) => setEntry({ ...entry, favoriteQuotes: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Plot notes</label>
          <textarea
            rows={3}
            value={entry.plotNotes}
            onChange={(e) => setEntry({ ...entry, plotNotes: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Themes</label>
          <textarea
            rows={2}
            value={entry.themes}
            onChange={(e) => setEntry({ ...entry, themes: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Other notes</label>
          <textarea
            rows={3}
            value={entry.freeformNotes}
            onChange={(e) => setEntry({ ...entry, freeformNotes: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="btn btn-primary" onClick={handleSaveJournal} disabled={saving}>
            {saving ? "Saving..." : "Save entry"}
          </button>
          {savedAt && (
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              Saved at {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
