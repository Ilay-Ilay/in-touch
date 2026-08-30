import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { SidebarSearch } from "./sidebar-search";
import type { User } from "../../schema/types";

export function AppSidebar() {
  const [isSearchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<User[] | null>(null);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSearch
          setSearchMode={setSearchMode}
          isSearchMode={isSearchMode}
          setSearchResults={setSearchResults}
        />
      </SidebarHeader>
      <SidebarContent>
        {isSearchMode && !searchResults && (
          <span className="flex flex-1 items-center justify-center p-4 text-xs text-muted-foreground">
            Search results will appear here...
          </span>
        )}
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
