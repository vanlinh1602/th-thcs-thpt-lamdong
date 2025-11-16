import { useEffect, useMemo, useRef, useState } from 'react';

type Option = { label: string; value: string };

type MultiSelectProps = {
  options: Option[];
  value: string[]; // controlled selected values
  onChange: (newValues: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  // optional props for accessibility/UX
  id?: string;
  className?: string;
};

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  id,
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filtered options by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Helpers
  const isSelected = (val: string) => value.indexOf(val) >= 0;

  const toggle = (val: string) => {
    if (disabled) return;
    const next = isSelected(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(next);
  };

  const removeTag = (val: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${className}`}
      id={id}
    >
      <button
        type="button"
        className={`w-full text-left flex items-center gap-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-60 ${
          open ? 'border-indigo-500' : 'border-gray-200'
        }`}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <div className="flex-1 flex flex-wrap gap-1 items-center">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-0.5 text-sm"
                >
                  <span>{opt ? opt.label : val}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(val);
                    }}
                    aria-label={`Remove ${val}`}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-2">
          {value.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="text-sm text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              Xóa
            </button>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <ul
            role="listbox"
            aria-multiselectable="true"
            className="max-h-48 overflow-auto p-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                Không có tùy chọn
              </li>
            ) : (
              filtered.map((opt) => {
                const checked = isSelected(opt.value);
                return (
                  <li key={opt.value} className="p-1">
                    <button
                      type="button"
                      onClick={() => toggle(opt.value)}
                      className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(opt.value)}
                          tabIndex={-1}
                        />
                        <div className="text-sm">{opt.label}</div>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
