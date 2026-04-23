import { headers } from 'next/headers';
import type {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent
} from '@mux/mux-node/resources/webhooks';

import { mux } from '@/lib/mux';

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetDeletedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('MUX_WEBHOOK_SECRET is not fount');
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get('mux-signature');

  if (!muxSignature) {
    return new Response('No signature found', { status: 401 });
  }

  const body: WebhookEvent = await req.json();

  mux.webhooks.verifySignature(
    JSON.stringify(body),
    { 'mux-signature': muxSignature },
    SIGNING_SECRET
  );

  switch (body.type) {
    case 'video.asset.created':
      {
      }
      break;

    case 'video.asset.ready':
      {
      }
      break;

    case 'video.asset.created':
      {
      }
      break;

    case 'video.asset.created':
      {
      }
      break;
  }

  return { body: 1 };
}
