import { Search, X } from "lucide-react";

import { Button } from "#components/ui/button";
import type { User } from "../../schema/types";
import { useEffect, useState } from "react";

type Props = {
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResults: React.Dispatch<React.SetStateAction<null | User[]>>;
  isSearchMode: boolean;
};

export function SidebarSearch({
  setSearchMode,
  isSearchMode,
  setSearchResults,
}: Props) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length <= 2) return;
    async function getSearchResults() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/users?q=${encodeURIComponent(search)}`,

        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        setSearchResults(null);

        return;
      }
      const data = await res.json();
      console.log(data);
      setSearchResults(data);
    }
    getSearchResults();
  }, [search]);

  return (
    <form className="flex items-center gap-1 py-2 px-4 border rounded-full h-12">
      <Search className="text-muted-foreground h-4 w-4" strokeWidth={2} />
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onFocus={() => setSearchMode(true)}
        placeholder="Search..."
        className="flex-1 min-w-0 outline-none text-sm"
      />

      {isSearchMode && (
        <Button
          type="button"
          size={"icon-sm"}
          variant={"secondary"}
          onClick={() => {
            setSearch("");
            setSearchMode(false);
            setSearchResults(null);
          }}
        >
          <X strokeWidth={3} />
        </Button>
      )}
    </form>
  );
}
