import { get } from 'lodash';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RenderField } from '@/features/schemas/components';
import { ReportField } from '@/features/schemas/type';
import { useModal } from '@/hooks/ConfirmModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type Props = {
  schema?: ReportField;
  formData: any;
  onChange: (path: string, value: any) => void;
};

export const FormRender = ({ schema, formData, onChange }: Props) => {
  const isMobile = useIsMobile();
  const { confirm } = useModal();

  const renderField = (
    fieldKey: string,
    field: ReportField,
    parentPath = ''
  ) => {
    const fieldPath = parentPath ? `${parentPath}.${fieldKey}` : fieldKey;
    const value = get(formData, fieldPath, '');
    return (
      <div className={field.inline && !isMobile ? 'col-span-2' : 'col-span-1'}>
        <RenderField
          value={value}
          originValues={formData}
          field={field}
          onChange={(key, v) => {
            onChange(`${parentPath ? `${parentPath}.` : ''}${key}`, v);
          }}
        />
      </div>
    );
  };

  const renderNestedFields = (
    fields: Record<string, ReportField>,
    parentPath = ''
  ) => {
    return Object.entries(fields).map(([fieldKey, field], index) => {
      if (field.fields) {
        // Nested subsection
        const sectionPath = parentPath ? `${parentPath}.${fieldKey}` : fieldKey;
        return (
          <div
            key={sectionPath}
            className={cn(
              'py-4',
              index ? 'border-t-2' : '',
              field.type !== 'group' ? 'col-span-full' : ''
            )}
          >
            <div
              className={cn('border-border', !parentPath ? 'ml-2 pl-4' : '')}
            >
              <span className="font-medium text-foreground">
                {field.name}
                {field.required ? (
                  <span className="ml-2 text-red-500">*</span>
                ) : null}
              </span>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNestedFields(field.fields, sectionPath)}
              </div>
            </div>
          </div>
        );
      }

      return renderField(fieldKey, field, parentPath);
    });
  };

  if (!schema) return null;

  return (
    <Card key={schema.key} className="bg-card border-border shadow-sm py-4">
      <div className="flex justify-end px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={() =>
                confirm({
                  title: 'Đặt lại',
                  description:
                    'Thầy/cô có chắc chắn muốn đặt lại dữ liệu trong bản này? Các thông tin trên bảng khác sẽ không ảnh hưởng',
                  onConfirm: () => {
                    onChange(schema.key, undefined);
                  },
                })
              }
              variant="outline"
              className="border-border hover:bg-muted bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Nhập lại
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>1. Xóa hết dữ liệu trong bản này để nhập lại</p>
            <p>2. Các thông tin bảng khác không ảnh hưởng</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <CardContent className="pt-0 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {schema?.fields && renderNestedFields(schema.fields, schema.key)}
          {schema?.type && renderField(schema.key, schema)}
        </div>
      </CardContent>
    </Card>
  );
};
