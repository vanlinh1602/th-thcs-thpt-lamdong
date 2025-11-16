import { ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { translations } from '@/locales/translations';

import { Input } from '../ui/input';

type Result = {
  file: File;
  url: string;
};

interface ImageDropzoneProps {
  onChange: (value: Result[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  clickable?: boolean;
  children?: React.ReactNode;
}

export function FileDropzone({
  onChange,
  accept = ['image/*'],
  maxFiles,
  maxSize = 7 * 1024 * 1024, // 7MB default
  className = '',
  clickable = true,
  children,
}: ImageDropzoneProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (files: File[]) => {
    const results: Result[] = [];
    files.map((file) => {
      if (
        !accept.includes(file.type) &&
        accept.includes('image/*') &&
        !file.type.includes('image')
      ) {
        toast.error(t(translations.errors.title), {
          description: `Tệp không hợp lệ. Chỉ chấp nhận các tệp có định dạng ${accept.join(
            ', '
          )}`,
        });
        return;
      }

      if (file.size > maxSize) {
        toast.error(t(translations.errors.title), {
          description: `Tệp không hợp lệ. Chỉ chấp nhận các tệp có kích thước nhỏ hơn ${
            maxSize / 1024 / 1024
          }MB`,
        });
        return;
      }
      results.push({
        file,
        url: URL.createObjectURL(file),
      });
    });
    onChange(results);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (maxFiles && files.length > maxFiles) {
      toast.error(t(translations.errors.title), {
        description: `Bạn chỉ được tải lên tối đa ${maxFiles} tệp`,
      });
    }

    if (files.length > 0) {
      handleFile(Array.from(files));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="flex-1 space-y-4 w-full">
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
                : `border-gray-300 dark:border-gray-700 ${
                    clickable
                      ? 'hover:border-blue-500 dark:hover:border-blue-500'
                      : ''
                  }`
            }`}
            onClick={() => {
              if (clickable) {
                fileInputRef.current?.click();
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept.join(',')}
              multiple={!(maxFiles === 1)}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  handleFile(Array.from(files));
                }
              }}
              className="hidden"
            />
            {children ? (
              children
            ) : (
              <div className="flex flex-col items-center justify-center m-4">
                <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kéo thả hoặc nhấn để tải lên
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Chỉ chấp nhận các tệp có định dạng ${accept.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
