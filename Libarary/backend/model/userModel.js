import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      unique: true, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["admin", "member"], // ✅ updated for library system
      required: true 
    },

    // 📌 Extra fields for library context
    borrowedBooksCount: { type: Number, default: 0 },
    totalBorrowed: { type: Number, default: 0 },
    returnedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      }
    ],
    overdueCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
