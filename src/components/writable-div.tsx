import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type WritableDivProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

// 非完全受控组件
export function WritableDiv({
  value,
  onChange,
  placeholder = '请输入内容...',
  className,
  ...props
}: WritableDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  // ✅ 同步外部 value（可控模式）
  const syncValue = (text: string) => {
    if (ref.current && ref.current.innerText !== text) {
      ref.current.innerText = text;
    }
  };

  const handleInput = () => {
    if (!onChange) return;
    if (isComposing) return; // 避免中文输入法问题

    const text = ref.current?.innerText.trim() ?? '';
    // const value = text.trim() ? text : '';

    onChange(text);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain').trim();

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const lines = text.split('\n');

    lines.forEach((line, i) => {
      const textNode = document.createTextNode(line);
      range.insertNode(textNode);

      // 👇 关键：推进 range
      range.setStartAfter(textNode);

      if (i < lines.length - 1) {
        const br = document.createElement('br');
        range.insertNode(br);

        // 👇 再推进
        range.setStartAfter(br);
      }
    });

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput(); // 同步 state
  };

  // ✅ 输入法处理
  const handleCompositionStart = () => setIsComposing(true);

  const handleCompositionEnd = () => {
    setIsComposing(false);
    handleInput();
  };

  // ✅ 初始化 value
  useEffect(() => {
    if (value !== undefined) {
      syncValue(value);
    }
  }, [value]);

  return (
    <div
      ref={ref}
      className={cn(
        'empty:before:text-muted-foreground outline-none empty:before:text-sm empty:before:content-[attr(data-placeholder)]',
        className
      )}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onInput={handleInput}
      onPaste={handlePaste}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      {...props}
    />
  );
}
