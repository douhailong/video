import { SidebarProvider } from '@/components/ui/sidebar';

import HomeNavbar from '../components/home-navbar';
import HomeSidebar from '../components/home-sidebar';

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <HomeNavbar />
      <div className='flex min-h-screen w-full pt-[4rem]'>
        <HomeSidebar />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default HomeLayout;
