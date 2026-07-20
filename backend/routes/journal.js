import express from "express";
import JournalEntry from "../models/JournalEntry.js";
import Book from "../models/Book.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

// GET /api/journal/:bookId - fetch journal entry for a book
router.get("/:bookId", async (req, res) => {
  const entry = await JournalEntry.findOne({ book: req.params.bookId, user: req.userId });
  res.json({ entry: entry || null });
});

// PUT /api/journal/:bookId - create or update the journal entry (upsert)
router.put("/:bookId", async (req, res) => {
  const book = await Book.findOne({ _id: req.params.bookId, user: req.userId });
  if (!book) return res.status(404).json({ message: "Book not found" });

  const entry = await JournalEntry.findOneAndUpdate(
    { book: req.params.bookId, user: req.userId },
    { ...req.body, book: req.params.bookId, user: req.userId },
    { new: true, upsert: true }
  );
  res.json({ entry });
});

export default router;
