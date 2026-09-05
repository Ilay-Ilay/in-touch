export default async function getChats() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch chats: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}
