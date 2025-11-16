import { get, set } from 'lodash';
import { Eye } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { Loading, SearchSelect } from '@/components';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReportStatusBadge } from '@/features/reports/components';
import { useReportConfig, useSumaryReport } from '@/features/reports/hooks';
import { ReportStatus } from '@/features/reports/type';
import { useSystemConfig } from '@/features/system/hooks';

export const TienDoTungTruong = () => {
  const [filter, setFilter] = useState<{
    area: string;
    ward: string;
    type: 'nl' | 'mn';
  }>({
    area: 'all',
    ward: '',
    type: 'mn',
  });

  const navigate = useNavigate();

  const {
    data: sumaryReport,
    isLoading: isLoadingSumaryReport,
    isFetching: isFetchingSumaryReport,
  } = useSumaryReport();
  const {
    data: systemConfig,
    isLoading: isLoadingSystemConfig,
    isFetching: isFetchingSystemConfig,
  } = useSystemConfig();
  const {
    data: reportConfig,
    isLoading: isLoadingReportConfig,
    isFetching: isFetchingReportConfig,
  } = useReportConfig(filter.type);
  const { cities, schools, areas } = systemConfig || {};

  const isLoading =
    isLoadingSumaryReport ||
    isLoadingSystemConfig ||
    isLoadingReportConfig ||
    isFetchingSumaryReport ||
    isFetchingSystemConfig ||
    isFetchingReportConfig;

  const allReportKeys = useMemo(() => {
    return reportConfig?.map((config) => config.reportKey) ?? [];
  }, [reportConfig]);

  const { wardsOptions } = useMemo(() => {
    return {
      wardsOptions: Object.entries(get(cities, ['68', 'wards'], {}))
        .filter(
          ([, value]) => filter.area === 'all' || value.area === filter.area
        )
        .map(([key, value]) => ({
          label: value.name,
          value: key,
        })),
    };
  }, [filter.area, cities]);

  const summaryData = useMemo(() => {
    const filteredReports = Object.values(sumaryReport ?? {}).filter(
      (school) => {
        const area = get(cities, ['68', 'wards', school.ward, 'area'], '');
        return (
          school.reportType === filter.type &&
          (filter.area === 'all' || area === filter.area) &&
          (filter.ward === '' || school.ward === filter.ward)
        );
      }
    );

    return filteredReports.map((report) => {
      const ward = report.ward;
      const area = get(cities, ['68', 'wards', ward, 'area'], '');

      const reportInfo = {
        id: report.id,
        ward,
        area,
        school: report.school,
      };
      const reportStatus: Record<string, ReportStatus> = {};
      Object.entries(report.status ?? {}).forEach(([status, reportKeys]) => {
        reportKeys.forEach((reportKey) => {
          set(reportStatus, [reportKey], status);
        });
      });
      return {
        info: reportInfo,
        data: reportStatus,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumaryReport, filter]);

  return (
    <div className="mt-4">
      {isLoading ? <Loading /> : null}
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div className="text-lg font-bold">
          Tổng số trường: {summaryData.length}
        </div>
        <div className="flex flex-wrap justify-end gap-2 mb-2">
          <div id="select_area" className="grid gap-2">
            <Label htmlFor="province">
              Chọn Khu Vực
              <span className="text-red-500">*</span>
            </Label>
            <Select
              key="area"
              value={filter.area}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, area: value, ward: '' }))
              }
            >
              <SelectTrigger className=" bg-white h-[38px] w-40">
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={'all'} value={'all'}>
                  Tất cả
                </SelectItem>
                {Object.entries(areas?.[68]?.merged || {}).map(
                  ([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div id="select_ward" className="grid gap-2 w-48">
            <Label htmlFor="ward">Phường/Xã</Label>
            <SearchSelect
              className="w-48"
              placeholder="Chọn phường xã"
              value={
                filter.ward
                  ? {
                      label: get(
                        cities,
                        ['68', 'wards', filter.ward, 'name'],
                        filter.ward
                      ),
                      value: filter.ward,
                    }
                  : null
              }
              options={wardsOptions}
              onChange={(value) =>
                setFilter((prev) => ({ ...prev, ward: value?.value || '' }))
              }
            />
          </div>
          <div id="select_type" className="grid gap-2">
            <Label htmlFor="province">Loại báo cáo</Label>
            <Select
              value={filter.type}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, type: value as 'nl' | 'mn' }))
              }
            >
              <SelectTrigger className="w-40 h-[38px]">
                <SelectValue placeholder="Chọn loại hình trường" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={'mn'} value={'mn'}>
                  Mầm non
                </SelectItem>
                <SelectItem key={'nl'} value={'nl'}>
                  Nhóm lớp
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="w-[50px] text-center text-white border">
              STT
            </TableHead>
            <TableHead className="text-center text-white border w-[200px]">
              Khu vực
            </TableHead>
            <TableHead className="text-center text-white border w-[200px]">
              Phường Xã
            </TableHead>
            <TableHead className="text-center text-white border w-[200px]">
              Trường
            </TableHead>
            <TableHead className="text-center text-white border w-[100px]">
              Tiến độ
            </TableHead>
            {reportConfig?.map((config) => (
              <TableHead
                key={config.reportKey}
                className="text-center text-white border"
              >
                {config.name}
              </TableHead>
            ))}
            <TableHead className="text-center text-white border w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaryData.map((reportData, index) => {
            const { info: reportInfo, data } = reportData;
            const { ward, area, school } = reportInfo;
            const totalDone = Object.values(data).filter(
              (status) => status === 'done'
            ).length;
            return (
              <TableRow key={school}>
                <TableCell className="text-center border">
                  {index + 1}
                </TableCell>
                <TableCell className="border">
                  {get(areas, ['68', 'merged', area, 'name'], area)}
                </TableCell>
                <TableCell className=" border">
                  {get(cities, ['68', 'wards', ward, 'name'], ward)}
                </TableCell>
                <TableCell className="border">
                  {get(schools, [school, 'name'], school)}
                </TableCell>
                <TableCell className="text-center border">
                  {totalDone} / {allReportKeys.length}
                </TableCell>
                {reportConfig?.map((config) => (
                  <TableCell
                    key={`${school}-${config.reportKey}`}
                    className="text-center border"
                  >
                    <ReportStatusBadge
                      status={
                        data[config.reportKey] || ('todo' as ReportStatus)
                      }
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center border">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/reports/${reportInfo.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
