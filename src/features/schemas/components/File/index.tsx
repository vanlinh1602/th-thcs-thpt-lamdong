import { Eye, File, Trash2 } from 'lucide-react';

import { FileDropzone } from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { generateID } from '@/lib/common';

import { ReportField } from '../../type';

type Props = {
  field: ReportField<'file'>;
  value: any;
  onChange: (path: string, value: any) => void;
};

export const FileRender = ({ field, value, onChange }: Props) => {
  const { config } = field;
  const { path, accept } = config;

  return (
    <div key={field.key} className="flex flex-col justify-end">
      <Label
        htmlFor={field.key}
        className="text-sm font-medium text-foreground"
      >
        {field.name}
        {field.required ? <span className="text-red-500">*</span> : null}
      </Label>
      {value?.fileName ? (
        <div className="flex justify-between items-center gap-2 bg-emerald-500 text-white px-2 rounded-md">
          <div className="flex items-center gap-2">
            <File className="w-4 h-4" />
            {value.fileName}
          </div>
          <div className="z-20">
            {value?.url ? (
              <Tooltip>
                <TooltipTrigger className="z-20">
                  <Button
                    variant="link"
                    size="icon"
                    className="text-blue cursor-pointer z-20"
                    onClick={() => {
                      let url = `${value.url}`;
                      if (url.includes(field.config.path)) {
                        url = `${url}?v=${generateID({ size: 3 })}`;
                      }
                      window.open(url, '_blank');
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xem file</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="link"
                  size="icon"
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    onChange(field.key, undefined);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa file</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        <>
          <FileDropzone
            accept={[accept]}
            maxFiles={1}
            onChange={(files) => {
              const file = files[0];
              onChange(field.key, {
                file: file.file,
                fileName: file.file.name,
                url: file.url,
                path,
              });
            }}
          />
        </>
      )}
    </div>
  );
};
