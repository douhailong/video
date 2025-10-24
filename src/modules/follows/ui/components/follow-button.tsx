import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { type ButtonProps, Button } from '@/components/ui/button';

type FollowButtonProps = {
  isFollowed: boolean;
} & ButtonProps;

const FollowButton = ({ isFollowed, className, ...restProps }: FollowButtonProps) => {
  return (
    <Button
      variant={isFollowed ? 'secondary' : 'default'}
      className={className}
      {...restProps}
    >
      {isFollowed ? '已关注' : '关注'}
    </Button>
  );
};

export default FollowButton;
