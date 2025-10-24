import HeadeNavbar from '../components/home-layout/heade-navbar';
import { SideNavbar } from '../components/home-layout/side-navbar';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeadeNavbar />
      <div className='flex min-h-screen w-full pt-[3.5rem]'>
        <SideNavbar />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </>
  );
};

export default HomeLayout;
