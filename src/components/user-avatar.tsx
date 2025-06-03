import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "size-9",
      xs: "size-4",
      sm: "size-6",
      lg: "size-10",
      xl: "size[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type UserAvatarProps = {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
} & VariantProps<typeof avatarVariants>;

const UserAvatar = ({
  imageUrl,
  name,
  size,
  className,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imageUrl} alt={name} />
    </Avatar>
  );
};

export default UserAvatar;
