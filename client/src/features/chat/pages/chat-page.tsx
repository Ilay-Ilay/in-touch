import { Button } from "#components/ui/button";
import { authClient } from "#lib/auth";
import { LogOut } from "lucide-react";

export default function Chat({}) {
  async function logOut() {
    const { error } = await authClient.signOut();

    if (error) {
      console.error(error);

      return;
    }
  }

  return (
    <div>
      <Button onClick={logOut}>
        Logout
        <LogOut />
      </Button>
      Chat is here
    </div>
  );
}
