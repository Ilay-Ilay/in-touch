import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { SidebarSearch } from "./sidebar-search";
import SearchResultTab from "./search-result-tab";
import type { User } from "../../schema/types";
import FullScreenLoader from "#components/ui/fullscreen-loader";
import SidebarChats from "./sidebar-chats";

export function AppSidebar() {
  const [isSearchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSearch
          setSearchLoading={setSearchLoading}
          setSearchMode={setSearchMode}
          isSearchMode={isSearchMode}
          setSearchResults={setSearchResults}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {isSearchMode ? (
            <>
              {searchLoading && (
                <div className="flex flex-1 items-center justify-center">
                  <FullScreenLoader />
                </div>
              )}

              {!searchLoading && !searchResults && (
                <span className="flex flex-1 items-center justify-center p-4 text-xs text-muted-foreground">
                  Search results will appear here...
                </span>
              )}

              {!searchLoading && searchResults?.length === 0 && (
                <span className="flex flex-1 items-center justify-center p-4 text-xs text-muted-foreground">
                  Nothing found...
                </span>
              )}

              {!searchLoading &&
                searchResults?.map((user) => (
                  <SearchResultTab key={user._id} user={user} />
                ))}
            </>
          ) : (
            <>
              <SidebarChats />
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
