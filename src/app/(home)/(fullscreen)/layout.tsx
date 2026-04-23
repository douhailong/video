import HomeLayout from '@/modules/home/ui/layout/home-layout';

const Layout = ({ children }: ChildrenProps) => (
  <HomeLayout isOpen={false}>{children}</HomeLayout>
);

export default Layout;
