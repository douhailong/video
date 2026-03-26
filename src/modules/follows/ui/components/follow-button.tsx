import { Check } from 'lucide-react';

import { type ButtonProps, Button } from '@/components/ui/button';

import { useFollow } from '@/modules/follows/hooks/use-follow';

type FollowButtonProps = {
  followed: boolean;
  onSuccess: () => void;
  userId: string;
} & ButtonProps;

const FollowButton = ({
  followed,
  userId,
  onSuccess,
  ...restProps
}: FollowButtonProps) => {
  const { onClick, isPending } = useFollow({
    followed,
    onSuccess,
    followerId: userId
  });

  return (
    <Button
      onClick={() => !isPending && onClick()}
      variant={followed ? 'secondary' : 'default'}
      {...restProps}
    >
      {followed ? '已关注' : '关注'}
    </Button>
  );
};

export default FollowButton;
