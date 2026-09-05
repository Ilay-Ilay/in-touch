export default function isThisYear(date: Date) {
  const now = new Date();
  const thisYear = now.getFullYear();
  return thisYear === date.getFullYear();
}
