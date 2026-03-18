import { DesktopNavbar, MobileNavbar } from '../components/home-layout/navbar';
import { Headbar } from '../components/home-layout/headbar';

type HomeLayoutProps = {
  children: ReactNode;
  isOpen?: boolean;
};

const HomeLayout = ({ children, isOpen = true }: HomeLayoutProps) => (
  <div className='flex min-h-screen flex-col pt-14 sm:flex-row'>
    <Headbar />
    {isOpen && <DesktopNavbar />}
    <main className='flex-1 overflow-y-auto'>{children}</main>
    {isOpen && <MobileNavbar />}
  </div>
);

export default HomeLayout;
