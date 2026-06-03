const formatMeta = (meta = {}) => {
  const entries = Object.entries(meta).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return "";
  }

  return ` ${JSON.stringify(Object.fromEntries(entries))}`;
};

const log = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${level.toUpperCase()} ${message}${formatMeta(meta)}`;

  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
};

module.exports = {
  error: (message, meta) => log("error", message, meta),
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
};
