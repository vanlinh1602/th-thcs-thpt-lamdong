import { isNil } from 'lodash';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { ReportStatus } from '../../type';

const map: Record<ReportStatus, { label: string; className: string }> = {
  todo: { label: 'Chưa làm', className: 'bg-muted text-foreground' },
  pending: { label: 'Đang làm', className: 'bg-yellow-100 text-yellow-900' },
  done: { label: 'Đã xong', className: 'bg-emerald-100 text-emerald-900' },
};

const ReportStatusBadge = ({
  status,
  value,
}: {
  status: ReportStatus;
  value?: number;
}) => {
  return (
    <Badge
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs',
        map[status].className
      )}
    >
      {!isNil(value) ? (
        <span className="text-xs font-bold mr-1">{value}</span>
      ) : null}
      <span>{map[status].label}</span>
    </Badge>
  );
};

export default ReportStatusBadge;
