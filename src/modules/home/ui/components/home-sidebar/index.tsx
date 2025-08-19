import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

import MainSection from './main-section';
import PersonalSection from './personal-section';

const HomeSidebar = () => {
  return (
    <Sidebar className='z-40 border-none pt-16' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
