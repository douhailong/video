import { cn } from '@/lib/utils';
import { type ButtonProps, Button } from '@/components/ui/button';

type FollowButtonProps = {
  isFollowed: boolean;
} & ButtonProps;

const FollowButton = ({
  isFollowed,
  onClick,
  disabled,
  className,
  size
}: FollowButtonProps) => {
  return (
    <Button
      size={size}
      variant={isFollowed ? 'secondary' : 'default'}
      className={cn('rounded-full', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isFollowed ? '取消关注' : '关注'}
    </Button>
  );
};

export default FollowButton;
