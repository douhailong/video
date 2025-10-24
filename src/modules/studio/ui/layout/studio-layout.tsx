import { SidebarProvider } from '@/components/ui/sidebar';

import StudioNavbar from '../components/studio-layout/studio-navbar';
import StudioSidebar from '../components/studio-layout/studio-sidebar';

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <StudioNavbar />
      <div className='flex min-h-screen w-full pt-[4rem]'>
        <StudioSidebar />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
