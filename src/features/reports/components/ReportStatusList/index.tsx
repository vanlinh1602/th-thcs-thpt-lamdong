import { useMemo } from 'react';

import { useReportConfig } from '../../hooks';
import { ReportStatus, UserReport } from '../../type';
import { ReportStatusBadge } from '..';

type Props = {
  reportType: string;
  statuses: UserReport['status'];
};

export const ReportStatusList = ({ reportType, statuses }: Props) => {
  const { data: reportConfigs } = useReportConfig(reportType);
  const calcStatus = useMemo(() => {
    const total = reportConfigs?.length || 0;
    const todo =
      total - (statuses?.done?.length || 0) - (statuses?.pending?.length || 0);
    return {
      todo,
      pending: statuses?.pending?.length || 0,
      done: statuses?.done?.length || 0,
    };
  }, [reportConfigs?.length, statuses]);

  return (
    <div className="flex items-center gap-2">
      {['todo', 'pending', 'done'].map((k) => {
        return (
          <div className="flex items-center gap-2" key={k}>
            <ReportStatusBadge
              status={k as ReportStatus}
              value={calcStatus?.[k as ReportStatus] || 0}
            />
          </div>
        );
      })}
    </div>
  );
};
