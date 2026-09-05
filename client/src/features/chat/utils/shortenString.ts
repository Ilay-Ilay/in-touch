export default function shortenString(string: string) {
  const shortened = string.length > 24 ? string.slice(0, 21) + "..." : string;
  return shortened;
}
