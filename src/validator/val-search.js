export const searchValidator = (req, res, next) => {
  let { search } = req.query;
  const errors = [];

  if (!search || typeof search !== "string") {
    return res.status(400).json({ error: "Search query is required and must be a string" });
  }

  // 1. Sanitize input
  search = search
    .replace(/<[^>]*>?/gm, "")         // Remove any HTML tags (XSS)
    .replace(/[^a-zA-Z0-9\s]/g, "")    // Remove special characters except spaces
    .trim()
    .toLowerCase();

  // 2. Split into words, remove empty, filter short/noisy words
  const wordList = search
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length >= 2 && /^[a-z0-9]+$/.test(word)); // Only keep alpha-num words ≥ 2

  if (wordList.length === 0) {
    return res.status(400).json({
      error: "Search query must contain valid alphanumeric keywords (at least 2 characters each)",
    });
  }

  // 3. Re-assign clean search string back to req.query
  req.query.search = wordList.join(" ");

  next();
};
