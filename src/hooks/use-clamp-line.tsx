import { useState, useRef } from 'react';

type UseClampLineProps = {
  text: string;
  line?: number;
};

export function useClampLine({ text, line }: UseClampLineProps) {
  const [state, setState] = useState({ isClamped: false, text: '' });

  const textRef = useRef<HTMLElement>(null);
  const lineHeightRef = useRef(0);
}
