export default async function getActiveChat(chatId: string) {
  const params = new URLSearchParams({
    chatId,
  });

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chat?${params.toString()}`,

    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Error getting chat please refresh");
  }

  return res.json();
}
