import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  const seconds = Math.floor((duration % 6000) / 1000);
  const miuntes = Math.floor(duration / 6000);

  return `${miuntes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function titleToSnakeCase(title: string) {
  return title
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
