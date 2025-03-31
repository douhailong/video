import HomeLayout from '@/modules/home/ui/layout/home-layout';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
