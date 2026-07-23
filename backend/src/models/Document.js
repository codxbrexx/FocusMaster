const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    pageCount: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
