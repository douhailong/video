import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  const seconds = Math.floor((duration % 6000) / 1000);
  const miuntes = Math.floor(duration / 6000);

  return `${miuntes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function titleToSnakeCase(title: string) {
  return title.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatTimeDistance(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
}

export function formatTime(date: Date, addSuffix?: boolean) {
  return format(date, `yyyy年MM月dd日${addSuffix ? ' HH:mm' : ''}`, { locale: zhCN });
}

export function intlNumber({
  intl = 'cn',
  number,
  notation
}: {
  intl?: string;
  number: number;
  notation: 'compact' | 'standard';
}) {
  return Intl.NumberFormat(intl, { notation }).format(number);
}
