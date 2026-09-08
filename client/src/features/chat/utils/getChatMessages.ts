export default async function getChatMessages(
  chatId: string | null,

  cursor?: string | undefined,
) {
  const url = new URL(`${import.meta.env.VITE_API_URL}/api/chat/${chatId}`);

  if (!chatId) return;

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Error receiving messages, please try again");
  }

  return await res.json();
}
