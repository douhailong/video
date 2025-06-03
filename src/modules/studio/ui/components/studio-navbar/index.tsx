import Link from "next/link";
import Image from "next/image";

import { SidebarTrigger } from "@/components/ui/sidebar";

import AuthButton from "@/modules/auth/ui/components/auth-button";
import StudioUploadModal from "../studio-upload-modal";

const StudioNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-sm">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center flex-shrink-0 space-x-2">
          <SidebarTrigger />
          <Link href="/studio" className="flex items-center gap-1">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <h1 className="text-xl font-semibold tracking-tighter">Studio</h1>
          </Link>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default StudioNavbar;
