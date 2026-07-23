const pdfParse = require("pdf-parse");
const Document = require("../../models/Document");
const DocumentChunk = require("../../models/DocumentChunk");
const { generateEmbedding } = require("./vectorSearch");

/**
 * Splits text into chunks of ~1000 characters with 100 character overlap.
 * 
 * @param {string} text 
 * @returns {string[]}
 */
function chunkText(text) {
  const chunkSize = 1000;
  const overlap = 100;
  const chunks = [];
  
  let index = 0;
  while (index < text.length) {
    let end = index + chunkSize;
    
    // If not at the end of text, try to find a natural break point (newline or period)
    if (end < text.length) {
      const nextNewline = text.indexOf('\n', end);
      const nextPeriod = text.indexOf('. ', end);
      
      // If we can find a natural break within 200 chars, use it
      if (nextNewline !== -1 && nextNewline - end < 200) {
        end = nextNewline + 1;
      } else if (nextPeriod !== -1 && nextPeriod - end < 200) {
        end = nextPeriod + 2;
      }
    } else {
      end = text.length;
    }
    
    const chunk = text.slice(index, end).trim();
    if (chunk.length > 50) { // Ignore tiny chunks
      chunks.push(chunk);
    }
    
    index = end - overlap;
    
    // Ensure we move forward
    if (index <= index - (end - index)) {
      index = end;
    }
  }
  
  return chunks;
}

/**
 * Processes an uploaded PDF document, chunks it, generates embeddings, and saves to MongoDB.
 * 
 * @param {Buffer} fileBuffer 
 * @param {string} filename 
 * @param {number} size 
 * @param {string} userId 
 */
async function processDocument(fileBuffer, filename, size, userId) {
  // 1. Parse PDF
  const data = await pdfParse(fileBuffer);
  const text = data.text;
  
  // 2. Create Document record
  const doc = await Document.create({
    user: userId,
    title: filename.replace(/\.[^/.]+$/, ""), // Strip extension
    filename,
    size,
    pageCount: data.numpages || 0,
  });
  
  // 3. Chunk text
  const chunks = chunkText(text);
  
  // 4. Generate embeddings and save chunks
  // We process chunks in batches to avoid rate limits
  const batchSize = 10;
  let chunkIndex = 0;
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    
    const chunkDocs = await Promise.all(
      batch.map(async (content) => {
        const embedding = await generateEmbedding(content);
        return {
          document: doc._id,
          user: userId,
          chunkIndex: chunkIndex++,
          content,
          embedding,
        };
      })
    );
    
    await DocumentChunk.insertMany(chunkDocs);
  }
  
  return {
    documentId: doc._id,
    title: doc.title,
    chunksProcessed: chunkIndex,
  };
}

module.exports = { processDocument, chunkText };
