import { useLocalStorage } from 'usehooks-ts';

import { PostSchema } from '@/lib/zod';

export function useDraft() {
  const [draft, setDraft, removeDraft] = useLocalStorage<PostSchema | null>(
    'draft-cache',
    null,
    { initializeWithValue: false }
  );

  return { draft, setDraft, removeDraft };
}
