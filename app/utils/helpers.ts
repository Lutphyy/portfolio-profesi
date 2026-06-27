/**
 * Generates a URL-friendly slug from a title string.
 * e.g. "My Awesome Project" → "my-awesome-project"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formats an ISO date string into a human-readable format.
 * e.g. "2024-01-15T10:30:00Z" → "15 Jan 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns a relative time string from an ISO date.
 * e.g. "2 jam lalu", "3 hari lalu"
 */
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "tahun"],
    [2592000, "bulan"],
    [86400, "hari"],
    [3600, "jam"],
    [60, "menit"],
  ];

  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) return `${count} ${label} lalu`;
  }

  return "Baru saja";
}

/**
 * Clamps a string to a maximum length, appending "..." if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Simple email validation using regex.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Joins CSS class names, filtering out falsy values.
 * Similar to the `clsx` library but zero-dependency.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
