'use client';

import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

type TabsSectionProps = {
  tab?: string;
  subTab?: string;
  className?: string;
};

const tabs = [{ tab: '作品', url: 'post' }];

const TabsSection = ({ tab, subTab, className }: TabsSectionProps) => {
  const router = useRouter();

  const onSelect = (current: string) => {
    const url = new URL(window.location.href);

    url.searchParams.set('tab', current);
    router.push(url.toString());
  };

  return (
    <Carousel opts={{ align: 'start', dragFree: true }}>
      <CarouselContent className='-ml-3'>
        {Array.from({ length: 14 }).map((_, index) => (
          <CarouselItem key={index} className='basis-auto pl-3'>
            <Badge className='cursor-pointer rounded-lg px-3 py-1 text-sm'>全部</Badge>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    // <Tabs defaultValue='like' value={tab} className={cn(className)}>
    //   <TabsList className='mt-3'>
    //     <TabsTrigger value='post' onClick={() => onSelect('post')}>
    //       作品
    //     </TabsTrigger>
    //     <TabsTrigger value='like' onClick={() => onSelect('like')}>
    //       喜欢
    //     </TabsTrigger>
    //     <TabsTrigger value='collection' onClick={() => onSelect('collection')}>
    //       收藏
    //     </TabsTrigger>
    //     <TabsTrigger value='history' onClick={() => onSelect('history')}>
    //       观看历史
    //     </TabsTrigger>
    //     <TabsTrigger value='watch_later' onClick={() => onSelect('watch_later')}>
    //       稍后再看
    //     </TabsTrigger>
    //   </TabsList>
    //   <TabsContent value='post'>作品</TabsContent>
    //   <TabsContent value='like'>喜欢</TabsContent>
    //   <TabsContent value='collection'>收藏</TabsContent>
    //   <TabsContent value='history'>观看历史</TabsContent>
    //   <TabsContent value='watch_later'>稍后再看</TabsContent>
    // </Tabs>
  );
};

export default TabsSection;
