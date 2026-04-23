import { type MediaType, WEBSITE_ASSETS_BUCKET } from '../constants';

export function buildSourceObjectId(
  mediaType: MediaType,
  assetId: string,
  filename: string
) {
  return `raw/${mediaType}/${assetId}/source/${filename}`;
}
