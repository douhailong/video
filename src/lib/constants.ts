import {
  visibilityEnum,
  likeStatusEnum,
  mediaTypeEnum,
  mediaStatusEnum
} from '@/db/schema';

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const DEFAULT_LIMIT = 10;

export const WEBSITE_ASSETS_BUCKET = 'website-assets';

export const visibility = visibilityEnum.enumValues;
export const likeStatus = likeStatusEnum.enumValues;

export const mediaType = mediaTypeEnum.enumValues;
export const mediaStatus = mediaStatusEnum.enumValues;

export type Visibility = (typeof visibility)[number];
export type LikeStatus = (typeof likeStatus)[number];
export type MediaType = (typeof mediaType)[number];
export type MediaStatus = (typeof mediaStatus)[number];
