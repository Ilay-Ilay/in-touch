export default function formatDate(date: Date) {
  return date.toLocaleDateString([], {
    year: "2-digit",

    month: "2-digit",

    day: "2-digit",
  });
}
