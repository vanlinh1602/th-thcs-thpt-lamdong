import { cloneDeep, set } from 'lodash';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { AllowAddConfig, ReportField } from '../../type';
import { RenderField } from '../RenderField';

type Props = {
  field: ReportField<'allowAdd'>;
  value: any[];
  onChange: (path: string, value: any) => void;
};

const initValue = (config: AllowAddConfig) => {
  const results = Object.keys(config.fields).reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as Record<string, any>);
  return [results];
};

export const AllowAdd = ({ field, value, onChange }: Props) => {
  const { config } = field;
  const [rowsData, setRowsData] = useState<any[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    setRowsData(value || []);
  }, [value, config]);

  return (
    <div>
      <div className="flex gap-2 items-center mt-2">
        {config.showTotal ? (
          <Label htmlFor={field.key} className="text-lg font-bold text-primary">
            {`Tổng số ${config.headerWithIndex || 'dòng'}: ${rowsData.length}`}
          </Label>
        ) : null}
        {rowsData.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (config.max && rowsData.length >= config.max) {
                  toast.error('Đã đạt số lượng tối đa');
                  return;
                }
                const newRow = initValue(config);
                const newRowsData = [...rowsData, ...newRow];
                onChange(field.key, newRowsData);
              }}
            >
              <Plus className="w-4 h-4" />
              Thêm {config.headerWithIndex ? config.headerWithIndex : 'dòng'}
            </Button>
            {rowsData.length > 1 ? (
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={rowsData.length <= 1}
                onClick={() => {
                  const newRowsData = rowsData.slice(0, -1);
                  onChange(field.key, newRowsData);
                }}
              >
                <Minus className="w-4 h-4" />
                Xóa {config.headerWithIndex
                  ? config.headerWithIndex
                  : 'dòng'}{' '}
                cuối
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="divide-y-2 divide-border">
        {rowsData.map((row, index) => {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {config.headerWithIndex ? (
                <div className="md:col-span-2 text-lg font-bold text-primary">
                  {config.headerWithIndex} {index + 1}
                </div>
              ) : null}
              {Object.entries(row).map(([key, v]) => {
                const rowField = config.fields[key];
                return (
                  <div
                    key={key}
                    className={cn(
                      rowField.inline && !isMobile ? 'col-span-2' : 'col-span-1'
                    )}
                  >
                    <RenderField
                      field={rowField}
                      onChange={(p, newValue) => {
                        const newRowsData = cloneDeep(rowsData);
                        set(newRowsData, [index, p], newValue);
                        onChange(field.key, newRowsData);
                      }}
                      value={v}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (config.max && rowsData.length >= config.max) {
              toast.error('Đã đạt số lượng tối đa');
              return;
            }
            const newRow = initValue(config);
            const newRowsData = [...rowsData, ...newRow];
            onChange(field.key, newRowsData);
          }}
        >
          <Plus className="w-4 h-4" />
          Thêm {config.headerWithIndex ? config.headerWithIndex : 'dòng'}
        </Button>
        {rowsData.length > 1 ? (
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={rowsData.length <= 1}
            onClick={() => {
              const newRowsData = rowsData.slice(0, -1);
              onChange(field.key, newRowsData);
            }}
          >
            <Minus className="w-4 h-4" />
            Xóa {config.headerWithIndex ? config.headerWithIndex : 'dòng'} cuối
          </Button>
        ) : null}
      </div>
    </div>
  );
};
