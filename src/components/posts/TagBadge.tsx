import React from "react";

interface TagBadgeProps {
  name: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ name }) => {
  return (
    <span
        className="bg-accent text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full hover:bg-accent/80 transition-colors"
    >
      {name}
    </span>
  );
};
