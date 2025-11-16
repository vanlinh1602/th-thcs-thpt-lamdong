import { get } from 'lodash';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Tutorial } from '@/components/Tutorial';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { ReportStatusList } from '@/features/reports/components';
import { useReport, useReportConfig } from '@/features/reports/hooks';
import { UserReport } from '@/features/reports/type';
import { useSystemConfig } from '@/features/system/hooks';
import { cn } from '@/lib/utils';

import { RenderReport } from './RenderReport';

const getBackgroudColor = (reportKey: string, status: UserReport['status']) => {
  if (status?.done?.includes(reportKey)) {
    return 'bg-emerald-500 text-white';
  }
  if (status?.pending?.includes(reportKey)) {
    return 'bg-yellow-400 text-white';
  }
  return 'bg-gray-400 text-white';
};

// ---------- Main Component ----------
export default function ReportListPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const { data: systemConfig } = useSystemConfig();
  const { data: report } = useReport(reportId || '');
  const { data: reportConfigs } = useReportConfig(report?.reportType || '');

  const { schools } = systemConfig ?? {};

  const [activeReport, setActiveReport] = useState<string>('');

  useEffect(() => {
    if (!activeReport) {
      setActiveReport(reportConfigs?.[0]?.reportKey || '');
    }
    return () => {
      setActiveReport('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportConfigs]);

  return (
    <div className="mx-auto px-4 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-center">
        <ArrowLeft
          className="h-6 w-6 cursor-pointer absolute left-2"
          onClick={() => {
            navigate(-1);
          }}
        />
        <div className="container mx-auto px-4 py-2">
          <h1 className="text-xl font-bold text-foreground text-balance text-center">
            Danh sách báo cáo -{' '}
            {get(schools, [report?.school || '', 'name'], '')}
          </h1>
          <div className=" text-sm text-muted-foreground text-center">
            <div className="text-muted-foreground font-bold">
              Tổng số báo cáo: {reportConfigs?.length || 0}
            </div>
            <div className="flex justify-center">
              <ReportStatusList
                reportType={report?.reportType || ''}
                statuses={report?.status}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-end items-center gap-2 mt-2">
        <Tutorial type="nhaplieu" />
        {/* <Button
          size="sm"
          onClick={() => navigate(`/reports/${reportId}/kiemdinh`)}
        >
          <ExternalLink className="w-4 h-4" />
          Xem thông tin kiểm định
        </Button> */}
      </div>

      <div className="mt-2">
        {reportConfigs && reportConfigs.length > 1 ? (
          <ButtonGroup id="reports-list" className="divide-x-2 flex-wrap">
            {reportConfigs?.map((it) => (
              <Button
                variant={activeReport === it.reportKey ? 'default' : 'link'}
                className={cn(
                  activeReport === it.reportKey
                    ? ''
                    : getBackgroudColor(it.reportKey, report?.status)
                )}
                onClick={() => setActiveReport(it.reportKey)}
                key={it.reportKey}
                value={it.reportKey}
              >
                {it.name}
              </Button>
            ))}
          </ButtonGroup>
        ) : null}
        <Card className="p-4 mt-2">
          {activeReport && (
            <RenderReport
              reportName={
                reportConfigs?.find((it) => it.reportKey === activeReport)
                  ?.name || ''
              }
              reportId={reportId || ''}
              reportKey={activeReport}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
