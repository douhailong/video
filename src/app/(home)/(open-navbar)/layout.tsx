import HomeLayout from '@/modules/home/ui/layout/home-layout';

const Layout = ({ children }: { children: ReactNode }) => (
  <HomeLayout>{children}</HomeLayout>
);

export default Layout;
