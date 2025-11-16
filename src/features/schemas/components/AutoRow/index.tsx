import { cloneDeep, set } from 'lodash';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AutoRowConfig, ReportField } from '../../type';
import { RenderField } from '../RenderField';

type Props = {
  field: ReportField<'autoRow'>;
  value: any;
  onChange: (path: string, value: any) => void;
};

const initValue = (config: AutoRowConfig) => {
  const results = Object.keys(config.fields).reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as Record<string, any>);
  return [results];
};

export const AutoRow = ({ field, value, onChange }: Props) => {
  const { config } = field;
  const [rowsData, setRowsData] = useState<any[]>([]);

  useEffect(() => {
    if (!value) {
      const init = initValue(config);
      setRowsData(init);
    } else {
      setRowsData(value.rows);
    }
  }, [value, config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value) || 0;
    if (!v) {
      onChange(field.key, {
        total: '',
        rows: [],
      });
      return;
    }

    let newRows = [];
    if (rowsData.length > v) {
      newRows = rowsData.slice(0, v);
    } else {
      newRows = [...rowsData];
      for (let i = rowsData.length; i < v; i++) {
        newRows.push(...initValue(config));
      }
    }
    onChange(field.key, {
      total: v,
      rows: newRows,
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-end border-b-2 pb-4">
        <Label
          htmlFor={field.key}
          className="text-sm font-medium text-foreground"
        >
          {config.label}
        </Label>
        <Input
          id={field.key}
          type="number"
          inputMode="numeric"
          value={value.total}
          onChange={handleChange}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
            }
          }}
          className="mt-1 border-border focus:ring-primary focus:border-primary rounded-lg shadow-sm"
          placeholder={'Nhập số'}
        />
      </div>
      <div className="divide-y-2 divide-border">
        {rowsData.map((row, index) => {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {Object.entries(row).map(([key, v]) => {
                const rowField = config.fields[key];
                return (
                  <div key={key}>
                    <RenderField
                      field={rowField}
                      onChange={(p, newValue) => {
                        const newRowsData = cloneDeep(rowsData);
                        set(newRowsData, [index, p], newValue);
                        onChange(`${field.key}.rows`, newRowsData);
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
    </div>
  );
};
