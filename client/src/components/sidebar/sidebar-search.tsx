import { Search, X } from "lucide-react";

import { Button } from "#components/ui/button";

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
  return (
    <form className="flex items-center gap-1 py-2 px-4 border rounded-full h-12">
      <Search className="text-muted-foreground h-4 w-4" strokeWidth={2} />
      <input
        onSelect={() => setSearchMode(true)}
        onBlur={() => setSearchMode(false)}
        placeholder="Search..."
        className="flex-1 min-w-0 outline-none text-sm"
      />

      {isSearchMode && (
        <Button
          size={"icon-sm"}
          variant={"secondary"}
          onClick={() => {
            setSearchMode(false);
          }}
        >
          <X strokeWidth={3} />
        </Button>
      )}
    </form>
  );
}
