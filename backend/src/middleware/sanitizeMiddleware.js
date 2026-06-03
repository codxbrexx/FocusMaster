const xss = require("xss");

const sanitizeValue = (value, excludedPaths, currentPath = []) => {
  const pathKey = currentPath.join(".");

  if (excludedPaths.has(pathKey)) {
    return value;
  }

  if (typeof value === "string") {
    return xss(value.trim());
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      sanitizeValue(item, excludedPaths, [...currentPath, String(index)]),
    );
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeValue(nestedValue, excludedPaths, [...currentPath, key]),
      ]),
    );
  }

  return value;
};

const sanitizeBody = (excludedPaths = []) => (req, res, next) => {
  req.body = sanitizeValue(req.body, new Set(excludedPaths));
  next();
};

module.exports = { sanitizeBody };
