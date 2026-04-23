import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

const FeedbackDrawer = ({ children }: ChildrenProps) => {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        className='text-sidebar-foreground w-60 gap-0 p-0 [&>button]:hidden'
        side='left'
      >
        <SheetHeader className='p-0'>
          <SheetTitle className='sr-only'>side navbar</SheetTitle>
          <div className='flex h-14 items-center gap-4 pl-2 sm:pl-4'>
            {/* <Trigger /> */}
          </div>
        </SheetHeader>
        <div className='p-3'></div>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackDrawer;
