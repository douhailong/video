import { usePathname } from 'next/navigation';

type ServerCoatProps = {
  children: React.ReactNode;
};

const ServerCoat = ({ children }: ServerCoatProps) => {
  const pathname = usePathname();

  return <div>{children}</div>;
};

export default ServerCoat;
