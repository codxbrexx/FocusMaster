const mongoose = require("mongoose");

const documentChunkSchema = mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Document",
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    chunkIndex: { type: Number, required: true },
    content: { type: String, required: true },
    // 1536 is standard for text-embedding-ada-002, adjust if using other models like Google embeddings
    embedding: { type: [Number] }, 
  },
  {
    timestamps: true,
  },
);

// We won't create the Atlas Vector Search index via Mongoose (it's managed via MongoDB Atlas UI or API).
// The index typically looks like:
// {
//   "mappings": {
//     "dynamic": true,
//     "fields": {
//       "embedding": {
//         "dimensions": 1536,
//         "similarity": "cosine",
//         "type": "knnVector"
//       }
//     }
//   }
// }

const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema);

module.exports = DocumentChunk;
