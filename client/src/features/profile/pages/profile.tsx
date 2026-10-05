import { Button } from "#components/ui/button";
import { authClient } from "#lib/auth";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {};

export default function Profile({}: Props) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name);
  }, [user]);

  return (
    <div className="min-h-screen">
      <div className="p-8 sm:max-w-[50%] flex flex-col gap-2">
        <form className=" p-4 bg-secondary rounded-md">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <input type="file" className="border border-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <input
                type="text"
                className="text-sm"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
