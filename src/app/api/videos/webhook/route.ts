import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import type {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent
} from '@mux/mux-node/resources/webhooks';
import { UTApi } from 'uploadthing/server';

import { mux } from '@/lib/mux';
import { db } from '@/db';
import { videos } from '@/db/schema';

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetDeletedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export const POST = async (req: Request) => {
  const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('MUX_WEBHOOK_SECRET is not set');
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get('mux-signature');

  if (!muxSignature) {
    return new Response('No signature found', { status: 401 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    { 'mux-signature': muxSignature },
    SIGNING_SECRET
  );

  switch (payload.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payload.data as VideoAssetCreatedWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      console.log('mux created-------------------');

      await db
        .update(videos)
        .set({ muxStatus: data.status, muxAssetId: data.id })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case 'video.asset.ready': {
      const data = payload.data as VideoAssetReadyWebhookEvent['data'];
      const playbackId = data.playback_ids?.[0].id;

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      if (!playbackId) {
        return new Response('Missing playback id', { status: 400 });
      }

      const duration = data.duration ? Math.round(data.duration * 1000) : 0;
      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

      const utApi = new UTApi();
      const [uploadPreview, uploadThumbnail] = await utApi.uploadFilesFromUrl([
        tempPreviewUrl,
        tempThumbnailUrl
      ]);

      if (!uploadPreview.data || !uploadThumbnail.data) {
        return new Response('Failed to upload preview or thumbnail', {
          status: 500
        });
      }

      const { key: previewKey, ufsUrl: previewUrl } = uploadPreview.data;
      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadThumbnail.data;

      console.log('mux ready-------------------');

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl,
          thumbnailKey,
          previewUrl,
          previewKey,
          duration
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case 'video.asset.errored': {
      const data = payload.data as VideoAssetErroredWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      console.log('mux errored-------------------');

      await db
        .update(videos)
        .set({ muxStatus: data.status })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case 'video.asset.deleted': {
      const data = payload.data as VideoAssetDeletedWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      console.log('mux deleted-------------------');

      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case 'video.asset.track.ready': {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent['data'] & {
        asset_id: string;
      };

      if (!data.asset_id) {
        return new Response('No asset id found', { status: 400 });
      }

      console.log('mux track.ready-------------------');

      await db
        .update(videos)
        .set({ muxTrackId: data.id, muxTrackStatus: data.status })
        .where(eq(videos.muxAssetId, data.asset_id));

      break;
    }
  }

  return new Response('Webhook received', { status: 200 });
};
