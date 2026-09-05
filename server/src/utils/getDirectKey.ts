export default function getDirectKey(
  userId: string,

  recipientId: string,
): string {
  return [userId, recipientId].sort().join(":");
}
