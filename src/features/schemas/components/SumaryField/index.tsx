import { get, isNaN } from 'lodash';
import { useEffect, useMemo } from 'react';

import { formatNumber } from '@/lib/common';

import { ReportField } from '../../type';

type Props = {
  field: ReportField<'summary'>;
  onChange: (key: string, value: any) => void;
  originValues?: Record<string, any>;
};

export const SumaryField = ({ field, onChange, originValues }: Props) => {
  const total = useMemo(() => {
    if (field.config?.divideFields) {
      let result = Number(get(originValues, field.config.divideFields[0], 0));
      const newArray = field.config.divideFields.slice(1);
      newArray.forEach((f) => {
        result = result / Number(get(originValues, f, 0));
      });
      return result;
    }
    const summaryFields = field.config?.summaryFields || [];
    return summaryFields.reduce((acc, f) => {
      return acc + Number(get(originValues, f, 0));
    }, 0);
  }, [originValues, field]);

  useEffect(() => {
    if (total) {
      onChange(field.key, total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div className="flex items-center justify-between h-full">
      <h3 className="text-base font-bold">
        {field.name}: {isNaN(total) ? '-' : formatNumber(total, 2)}{' '}
        {field.config?.footer || ''}
      </h3>
    </div>
  );
};
