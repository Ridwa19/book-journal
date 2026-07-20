import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    author: { type: String, default: "Unknown" },
    coverUrl: { type: String, default: "" },
    isbn: { type: String, default: "" },
    genre: { type: String, default: "Unclassified" },
    classification: { type: String, enum: ["Fiction", "Non-Fiction"], default: "Fiction" },
    shelf: {
      type: String,
      enum: ["Wishlist", "Reading Now", "Finished", "Abandoned"],
      default: "Wishlist",
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    pageCount: { type: Number, default: 0 },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
