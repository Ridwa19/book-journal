import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    characters: { type: String, default: "" },
    favoriteQuotes: { type: String, default: "" },
    plotNotes: { type: String, default: "" },
    themes: { type: String, default: "" },
    freeformNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("JournalEntry", journalEntrySchema);
