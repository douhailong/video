"use client";

import { useState, useEffect } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

import { cn } from "@/lib/utils";

type CategoriesCarouselProps = {
  value?: string;
  data: { label: string; value: string }[];
  onSelect: (value?: string) => void;
};

const CategoriesCarousel = ({
  value,
  data,
  onSelect,
}: CategoriesCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          current === 1 && "hidden",
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          <CarouselItem className="pl-3 basis-auto" onClick={() => onSelect()}>
            <Badge
              variant={!value ? "default" : "secondary"}
              className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
            >
              All
            </Badge>
          </CarouselItem>
          {data.map((item) => (
            <CarouselItem
              key={item.value}
              className="pl-3 basis-auto"
              onClick={() => onSelect(item.value)}
            >
              <Badge
                variant={value === item.value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
              >
                {item.label}
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>

      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          current === count && "hidden",
        )}
      />
    </div>
  );
};

const CategoriesSkeleton = () => {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
        )}
      />
      <Carousel
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          {Array.from({ length: 14 }).map((_, index) => (
            <CarouselItem key={index} className="pl-3 basis-auto">
              <Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold">
                &nbsp;
              </Skeleton>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
        )}
      />
    </div>
  );
};

CategoriesCarousel.Skeleton = CategoriesSkeleton;

export default CategoriesCarousel;
