import { useUI } from "../../providers/UIContext";
import type { User } from "../../schema/types";

type Props = {
  user: User;
};

export default function SearchResultTab({ user }: Props) {
  const { selectedUser, setSelectedUser } = useUI();

  return (
    <div
      className={`${selectedUser?._id === user._id ? "bg-brand" : ""} border-b cursor-pointer p-2 rounded-md`}
      onClick={() => {
        setSelectedUser(user);
      }}
    >
      <div
        className="flex
       items-center gap-2"
      >
        {user.image ? (
          <img />
        ) : (
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {user.name ? user.name : user.username}
          </span>
          <span
            className={`text-xs ${selectedUser?._id === user._id ? "text-primary" : "text-muted-foreground"}`}
          >
            @{user.username}
          </span>
        </div>
      </div>
    </div>
  );
}
