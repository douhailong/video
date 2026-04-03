'use client';

import { useState, useEffect } from 'react';
import { ArrowUpFromLine } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <Button
      size='icon'
      variant='secondary'
      onClick={scrollToTop}
      className='fixed bottom-24 right-4 z-50 sm:bottom-12'
    >
      <ArrowUpFromLine />
    </Button>
  );
};

export default ToTop;
