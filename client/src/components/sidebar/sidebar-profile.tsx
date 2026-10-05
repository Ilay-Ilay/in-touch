import { authClient } from "#lib/auth";
import { ChevronRight } from "lucide-react";
import Avatar from "./avatar";
import { useLocation, useNavigate } from "react-router";
import { useUI } from "../../providers/UIContext";

type Props = {};

export default function SidebarProfile({}: Props) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const { setActiveChat } = useUI();

  const { name, username, image } = user;
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`${location.pathname === "/profile" ? "bg-brand-dark" : "bg-secondary"} rounded-md flex items-center gap-2 p-2 justify-between cursor-pointer`}
      onClick={() => {
        navigate("/profile", {
          replace: true,
        });
        setActiveChat({
          chatId: null,
          userId: null,
        });
      }}
    >
      <div className="flex items-center gap-2">
        <Avatar name={name} username={username} image={image} />
        <div className="flex flex-col gap-1">
          <span className="text-sm"> {name ? name : username}</span>
          <span className="text-xs text-muted-foreground">
            @{name ? name : username}
          </span>
        </div>
      </div>
      <ChevronRight strokeWidth={1} className="text-muted-foreground" />
    </div>
  );
}
