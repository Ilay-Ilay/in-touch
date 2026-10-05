import React from "react";

type Props = {
  image: string;
  username: string;
  name?: string | undefined | null;
};

export default function Avatar({ image, username, name }: Props) {
  return image ? (
    <img />
  ) : (
    <div className="h-12 w-12 rounded-full bg-brand flex items-center justify-center">
      <span className="font-semibold">
        {name ? name.charAt(0).toUpperCase() : username.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
