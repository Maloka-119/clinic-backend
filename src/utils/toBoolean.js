function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;

  if (typeof value === 'number') return value === 1;

  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === '1' || v === 'true' || v === 't' || v === 'yes' || v === 'y') return true;
    if (v === '0' || v === 'false' || v === 'f' || v === 'no' || v === 'n') return false;
    // Fall back: non-empty unknown strings are considered true.
    return v.length > 0;
  }

  return Boolean(value);
}

module.exports = toBoolean;

