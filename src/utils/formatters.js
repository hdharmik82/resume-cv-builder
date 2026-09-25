export function formatDate(dateString) {
  if (!dateString) return "";
  if (dateString.toLowerCase() === "present") return "Present";
  
  // If format is YYYY-MM
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mIndex = parseInt(month, 10) - 1;
    if (mIndex >= 0 && mIndex < 12) {
      return `${monthNames[mIndex]} ${year}`;
    }
  }

  return dateString;
}

export function formatUrl(url) {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function sanitizeUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed)) return "#";
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
