import Link from 'next/link';
import Image from 'next/image';

export const HomeLogo = () => (
  <Link href='/' className='w-23 relative h-8'>
    <Image src='/youtube-home.svg' alt='youtube-logo' fill />
  </Link>
);
