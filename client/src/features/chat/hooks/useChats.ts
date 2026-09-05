import { useQuery } from "@tanstack/react-query";

import getChats from "../utils/getChats";

export default function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });
}
