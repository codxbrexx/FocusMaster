const pdfParse = require("pdf-parse");

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
    const prevIndex = index;
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
    
    // Apply overlap, but guarantee forward progress
    index = end - overlap;
    if (index <= prevIndex) {
      index = prevIndex + 1;
    }
  }
  
  return chunks;
}

/**
 * Parses a PDF buffer and returns chunked text strings.
 *
 * This function is a pure data-transformation layer. It does NOT access
 * the database. The caller (controller) is responsible for creating the
 * Document record, generating embeddings, and saving DocumentChunk records.
 *
 * @param {Buffer} fileBuffer - Raw PDF file buffer
 * @returns {Promise<{ text: string, chunks: string[], pageCount: number }>}
 */
async function processDocument(fileBuffer) {
  // 1. Parse PDF
  const data = await pdfParse(fileBuffer);
  
  // 2. Chunk text
  const chunks = chunkText(data.text);
  
  return {
    text: data.text,
    chunks,
    pageCount: data.numpages || 0,
  };
}

module.exports = { processDocument, chunkText };
