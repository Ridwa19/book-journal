import express from "express";
import Book from "../models/Book.js";
import JournalEntry from "../models/JournalEntry.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

// GET /api/books  (optional ?shelf=Reading Now)
router.get("/", async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.shelf) filter.shelf = req.query.shelf;
  const books = await Book.find(filter).sort({ updatedAt: -1 });
  res.json({ books });
});

// GET /api/books/search?q=... -> proxies Open Library so the frontend
// never needs a separate API key, and results are consistent server-side.
router.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ message: "Query param 'q' is required" });

  try {
    const resp = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=15`
    );
    const data = await resp.json();
    const results = (data.docs || []).map((d) => ({
      title: d.title,
      author: d.author_name?.[0] || "Unknown",
      isbn: d.isbn?.[0] || "",
      coverUrl: d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
        : "",
      pageCount: d.number_of_pages_median || 0,
      firstPublishYear: d.first_publish_year || null,
    }));
    res.json({ results });
  } catch (err) {
    res.status(502).json({ message: "Book search provider is unavailable", error: err.message });
  }
});

// POST /api/books  - add a book to a shelf
router.post("/", async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, user: req.userId });
    res.status(201).json({ book });
  } catch (err) {
    res.status(400).json({ message: "Could not add book", error: err.message });
  }
});

// PATCH /api/books/:id - update shelf, rating, dates, etc.
router.patch("/:id", async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ book });
});

// DELETE /api/books/:id
router.delete("/:id", async (req, res) => {
  const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!book) return res.status(404).json({ message: "Book not found" });
  await JournalEntry.deleteMany({ book: book._id });
  res.json({ message: "Book removed" });
});

export default router;
