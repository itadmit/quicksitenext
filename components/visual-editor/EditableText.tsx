'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  Bold, Italic, Link as LinkIcon, RemoveFormatting,
  Heading1, Heading2, List, ListOrdered, Unlink,
} from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  richText?: boolean;
  style?: React.CSSProperties;
};

export default function EditableText({
  value,
  onChange,
  tag: Tag = 'span',
  className = '',
  placeholder = 'לחצו לעריכה...',
  richText = false,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (ref.current && !isEditing) {
      if (richText) {
        ref.current.innerHTML = value || '';
      } else {
        ref.current.textContent = value || '';
      }
    }
  }, [value, isEditing, richText]);

  const detectActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    const blockTag = document.queryCommandValue('formatBlock');
    if (blockTag === 'h2') formats.add('h2');
    if (blockTag === 'h3') formats.add('h3');
    const sel = window.getSelection();
    if (sel?.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== ref.current) {
        if (node instanceof HTMLAnchorElement) { formats.add('link'); break; }
        node = node.parentNode;
      }
    }
    setActiveFormats(formats);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
      lastValueRef.current = value;
      setTimeout(() => {
        ref.current?.focus();
        const selection = window.getSelection();
        if (selection && ref.current) {
          const range = document.createRange();
          range.selectNodeContents(ref.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }, 0);
    }
  }, [isEditing, value]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setShowToolbar(false);
    if (!ref.current) return;
    const newValue = richText ? ref.current.innerHTML : (ref.current.textContent || '');
    if (newValue !== lastValueRef.current) {
      onChange(newValue);
    }
  }, [onChange, richText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      ref.current?.blur();
    }
    if (!richText && e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
    e.stopPropagation();
  }, [richText]);

  const handleSelect = useCallback(() => {
    if (!isEditing || !richText) return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && ref.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const vw = window.innerWidth;
      let left = rect.left + rect.width / 2 - 130;
      left = Math.max(8, Math.min(left, vw - 268));
      setToolbarPos({
        top: rect.top - 52,
        left,
      });
      setShowToolbar(true);
      detectActiveFormats();
    } else {
      setShowToolbar(false);
    }
  }, [isEditing, richText, detectActiveFormats]);

  const execCommand = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    detectActiveFormats();
  }, [detectActiveFormats]);

  const handleLink = useCallback(() => {
    if (activeFormats.has('link')) {
      execCommand('unlink');
    } else {
      const url = prompt('הכניסו כתובת URL:');
      if (url) execCommand('createLink', url);
    }
  }, [execCommand, activeFormats]);

  const TagComponent = Tag as React.ElementType;
  const isEmpty = !value;

  return (
    <>
      <TagComponent
        ref={ref}
        className={`
          ${className}
          relative transition-all duration-150
          ${isEditing
            ? 'outline-none ring-2 ring-ocean/30 ring-offset-1 rounded-sm'
            : 'cursor-text hover:ring-1 hover:ring-ocean/15 hover:ring-offset-1 hover:rounded-sm'
          }
          ${isEmpty && !isEditing ? 'before:content-[attr(data-placeholder)] before:text-current before:opacity-30 before:pointer-events-none' : ''}
        `}
        style={style}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        onMouseUp={handleSelect}
        data-placeholder={placeholder}
        data-no-select
      >
        {richText ? undefined : (value || placeholder)}
      </TagComponent>

      {/* ─── Floating rich text toolbar ─── */}
      {showToolbar && richText && (
        <div
          className="fixed z-[100] overflow-hidden rounded-lg bg-navy shadow-2xl ring-1 ring-white/10"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Arrow */}
          <div
            className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-navy"
          />

          <div className="relative flex items-center px-1 py-0.5">
            <ToolbarBtn
              onClick={() => execCommand('bold')}
              active={activeFormats.has('bold')}
              title="Bold (⌘B)"
            >
              <Bold className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => execCommand('italic')}
              active={activeFormats.has('italic')}
              title="Italic (⌘I)"
            >
              <Italic className="h-3.5 w-3.5" />
            </ToolbarBtn>

            <ToolbarDivider />

            <ToolbarBtn
              onClick={() => execCommand('formatBlock', 'h2')}
              active={activeFormats.has('h2')}
              title="כותרת H2"
            >
              <Heading1 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => execCommand('formatBlock', 'h3')}
              active={activeFormats.has('h3')}
              title="כותרת H3"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </ToolbarBtn>

            <ToolbarDivider />

            <ToolbarBtn
              onClick={() => execCommand('insertUnorderedList')}
              active={activeFormats.has('ul')}
              title="רשימה"
            >
              <List className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => execCommand('insertOrderedList')}
              active={activeFormats.has('ol')}
              title="רשימה ממוספרת"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </ToolbarBtn>

            <ToolbarDivider />

            <ToolbarBtn
              onClick={handleLink}
              active={activeFormats.has('link')}
              title={activeFormats.has('link') ? 'הסר קישור' : 'הוסף קישור'}
            >
              {activeFormats.has('link') ? (
                <Unlink className="h-3.5 w-3.5" />
              ) : (
                <LinkIcon className="h-3.5 w-3.5" />
              )}
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => execCommand('removeFormat')}
              title="הסר עיצוב"
            >
              <RemoveFormatting className="h-3.5 w-3.5" />
            </ToolbarBtn>
          </div>
        </div>
      )}
    </>
  );
}

function ToolbarBtn({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
        active
          ? 'bg-white/20 text-white'
          : 'text-white/50 hover:bg-white/10 hover:text-white'
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-0.5 h-4 w-px bg-white/10" />;
}
