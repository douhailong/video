import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const avatarVariants = cva('', {
  variants: {
    size: {
      default: 'size-8',
      xs: 'size-4',
      sm: 'size-6',
      lg: 'size-9',
      xl: 'size-[120px]'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

type UserAvatarProps = {
  imageUrl?: string | null;
  name?: string | null;
  className?: string;
  onClick?: () => void;
} & VariantProps<typeof avatarVariants>;

const UserAvatar = ({ imageUrl, name, size, className, onClick }: UserAvatarProps) => {
  return (
    <Avatar className={cn(avatarVariants({ size, className }))} onClick={onClick}>
      <AvatarImage src={imageUrl ?? '/user-placeholder.svg'} alt={name ?? 'User'} />
      <AvatarFallback />
    </Avatar>
  );
};

export default UserAvatar;
