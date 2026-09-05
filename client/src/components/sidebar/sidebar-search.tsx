import { Search, X } from "lucide-react";

import { Button } from "#components/ui/button";
import { useEffect, useState } from "react";
import type { User } from "../../schema/types";

type Props = {
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResults: React.Dispatch<React.SetStateAction<null | User[]>>;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchMode: boolean;
};

export function SidebarSearch({
  setSearchMode,
  isSearchMode,
  setSearchResults,
  setSearchLoading,
}: Props) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length <= 2) {
      setSearchResults(null);

      setSearchLoading(false);

      return;
    }

    const controller = new AbortController();

    async function getSearchResults() {
      setSearchLoading(true);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/search/users?q=${encodeURIComponent(search)}`,

          {
            credentials: "include",

            signal: controller.signal,
          },
        );

        if (!res.ok) {
          setSearchResults(null);

          return;
        }

        const data = await res.json();

        setSearchResults(data.users);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);

        setSearchResults(null);
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }

    const timeout = setTimeout(getSearchResults, 500);

    return () => {
      clearTimeout(timeout);

      controller.abort();
    };
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
