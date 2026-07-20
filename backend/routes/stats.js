import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

// GET /api/stats/overview - counts per shelf + this year's progress toward goal
router.get("/overview", async (req, res) => {
  const user = await User.findById(req.userId);
  const books = await Book.find({ user: req.userId });

  const shelfCounts = { Wishlist: 0, "Reading Now": 0, Finished: 0, Abandoned: 0 };
  books.forEach((b) => { shelfCounts[b.shelf] = (shelfCounts[b.shelf] || 0) + 1; });

  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const finishedThisYear = books.filter(
    (b) => b.shelf === "Finished" && b.finishedAt && new Date(b.finishedAt) >= yearStart
  ).length;

  res.json({
    shelfCounts,
    readingGoal: user.readingGoal,
    finishedThisYear,
    totalBooks: books.length,
  });
});

// GET /api/stats/history - finished-book counts by year (up to 5 years back) + genre breakdown
router.get("/history", async (req, res) => {
  const books = await Book.find({ user: req.userId, shelf: "Finished", finishedAt: { $ne: null } });

  const currentYear = new Date().getFullYear();
  const byYear = {};
  for (let y = currentYear - 4; y <= currentYear; y++) byYear[y] = 0;

  const byGenre = {};
  const byClassification = { Fiction: 0, "Non-Fiction": 0 };

  books.forEach((b) => {
    const year = new Date(b.finishedAt).getFullYear();
    if (byYear[year] !== undefined) byYear[year] += 1;
    byGenre[b.genre] = (byGenre[b.genre] || 0) + 1;
    byClassification[b.classification] = (byClassification[b.classification] || 0) + 1;
  });

  res.json({ byYear, byGenre, byClassification });
});

export default router;
