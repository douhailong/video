import { DesktopNavbar, MobileNavbar } from '../components/home-layout/navbar';
import { Headbar } from '../components/home-layout/headbar';

type HomeLayoutProps = {
  children: ReactNode;
  isFull?: boolean;
};

export default function HomeLayout({ children, isFull = true }: HomeLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col pt-14 sm:flex-row'>
      <Headbar />
      {isFull && <DesktopNavbar />}
      <main className='flex-1 overflow-y-auto'>{children}</main>
      {isFull && <MobileNavbar />}
    </div>
  );
}
