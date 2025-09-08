import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  ISBN: { type: String, unique: true, required: true },
  coverImage: { type: String },
  availability: { type: String, enum: ["available", "borrowed" , "reserved"], default: "available" },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  borrowedDate: { type: Date },
  returnDate: { type: Date },
  reservedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);
export default Book;
