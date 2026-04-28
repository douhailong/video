import HomeLayout from '@/modules/home/ui/layout/home-layout';

export default function Layout({ children }: ChildrenProps) {
  return <HomeLayout isFull={false}>{children}</HomeLayout>;
}
