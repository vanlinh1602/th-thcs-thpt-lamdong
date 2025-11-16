import MultiSelect from '@/components/MultiSelect';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatNumber, generateID, parseNumber } from '@/lib/common';
import { cn } from '@/lib/utils';

import { ReportField } from '../../type';
import { AllowAdd } from '../AllowAdd/idnex';
import { AutoRow } from '../AutoRow';
import { FileRender } from '../File';
import { SumaryField } from '../SumaryField';
import { TableRender } from '../TableRender';

type Props = {
  field: ReportField;
  onChange: (key: string, value: any) => void;
  value: any;
  originValues?: Record<string, any>;
};

export const RenderField = ({
  field,
  onChange,
  value,
  originValues,
}: Props) => {
  switch (field.type) {
    case 'text': {
      return (
        <div key={field.key} className="flex flex-col justify-end">
          <Label
            htmlFor={field.key}
            className="text-sm font-medium text-foreground"
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
          <Input
            id={field.key}
            type="text"
            value={value as string}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="mt-1 border-border focus:ring-primary focus:border-primary rounded-lg shadow-sm"
            placeholder={`Nhập ${field.name.toLowerCase()}...`}
          />
        </div>
      );
    }
    case 'textarea': {
      return (
        <div key={field.key} className="col-span-full ">
          <Label
            htmlFor={field.key}
            className="text-sm font-medium text-foreground"
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
          <Textarea
            id={field.key}
            value={value as string}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="mt-1 border-border focus:ring-primary focus:border-primary rounded-lg shadow-sm"
            rows={4}
            placeholder={`Nhập ${field.name.toLowerCase()}...`}
          />
        </div>
      );
    }
    case 'number': {
      return (
        <div key={field.key} className="flex flex-col justify-end">
          <Label
            htmlFor={field.key}
            className="text-sm font-medium text-foreground"
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
          <Input
            id={field.key}
            type="text"
            inputMode="numeric"
            value={formatNumber(value)}
            onChange={(e) => {
              const number = parseNumber(e.target.value);
              if (!number || !isNaN(Number(number))) {
                onChange(field.key, number);
              }
            }}
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
      );
    }
    case 'dropdown': {
      return (
        <div key={field.key} className="flex flex-col justify-end mb-2">
          <Label
            htmlFor={field.key}
            className={cn(
              'text-sm font-medium text-foreground',
              field.config?.highlight ? 'text-red-500 font-bold text-base' : ''
            )}
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
          <Select value={value} onValueChange={(v) => onChange(field.key, v)}>
            <SelectTrigger className="h-9 mt-1">
              <SelectValue placeholder="Chọn giá trị" />
            </SelectTrigger>
            <SelectContent>
              {field.config?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    case 'table': {
      return <TableRender field={field} onChange={onChange} value={value} />;
    }
    case 'checkbox': {
      const id = generateID({ size: 5 });
      return (
        <div key={`${field.key}-${id}`} className="flex space-x-2 items-center">
          <Checkbox
            id={`${field.key}-${id}`}
            checked={value as boolean}
            onCheckedChange={(c) => onChange(field.key, c)}
          />
          <Label
            htmlFor={`${field.key}-${id}`}
            className="text-sm font-medium text-foreground"
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
        </div>
      );
    }
    case 'allowAdd': {
      return <AllowAdd field={field} onChange={onChange} value={value} />;
    }
    case 'summary': {
      return (
        <SumaryField
          field={field}
          onChange={onChange}
          originValues={originValues}
        />
      );
    }
    case 'autoRow': {
      return <AutoRow field={field} onChange={onChange} value={value} />;
    }
    case 'date': {
      return (
        <div key={field.key} className="flex flex-col justify-end">
          <Label
            htmlFor={field.key}
            className="text-sm font-medium text-foreground"
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
          <DatePicker
            className="mt-1"
            value={value ? new Date(value) : undefined}
            onChange={(date) => {
              onChange(field.key, date.getTime());
            }}
          />
        </div>
      );
    }
    case 'file': {
      return <FileRender field={field} onChange={onChange} value={value} />;
    }
    case 'multiSelect': {
      return (
        <div key={field.key} className="flex flex-col justify-end">
          <Label
            htmlFor={field.key}
            className="text-sm font-medium text-foreground"
          >
            {field.name}
            {field.required ? <span className="text-red-500">*</span> : null}
          </Label>
          <MultiSelect
            options={field.config?.options || []}
            value={value}
            onChange={(v) => onChange(field.key, v)}
          />
        </div>
      );
    }
  }
};
