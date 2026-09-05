import isThisYear from "./isThisyear";
import isTodaysDate from "./isTodaysDate";

export default function formatMessageDate(date: Date) {
  if (isTodaysDate(date)) {
    return "Today";
  }

  if (isThisYear(date)) {
    return date.toLocaleDateString("en-US", {
      month: "long",

      day: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",

    month: "long",

    day: "2-digit",
  });
}
