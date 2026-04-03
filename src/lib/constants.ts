import { visibleEnum, processEnum, likeEnum } from '@/db/schema';

export const DEFAULT_LIMIT = 10;

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const PROCESS_VALUES = processEnum.enumValues;

export const VISIBLE_VALUES = visibleEnum.enumValues;

export const LIKE_VALUES = likeEnum.enumValues;

export const MINIO_BUCKET = 'youtube-clone';
