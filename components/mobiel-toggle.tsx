import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';
import ServerSideBar from '@/components/server/server-side-bar';

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu></Menu>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0 flex gap-0'>
        <div className='w-[72px]'>
          <NavigationSidebar></NavigationSidebar>
        </div>
        <ServerSideBar serverId={serverId}></ServerSideBar>
      </SheetContent>
    </Sheet>
  );
};
