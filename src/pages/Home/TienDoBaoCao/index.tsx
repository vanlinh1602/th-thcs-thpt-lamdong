import { get, keyBy } from 'lodash';
import { useMemo, useState } from 'react';

import { Loading } from '@/components';
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
import { useSumaryReport } from '@/features/reports/hooks';
import { useSystemConfig } from '@/features/system/hooks';
import { formatNumber } from '@/lib/common';

const mapping = [
  {
    key: 'todo',
    name: 'Chưa thực hiện',
  },
  {
    key: 'pending',
    name: 'Đang thực hiện',
  },
  {
    key: 'done',
    name: 'Xong',
  },
  {
    key: 'total',
    name: 'Tổng',
  },
];

export const TienDoBaoCao = () => {
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
  const isLoading =
    isLoadingSumaryReport ||
    isLoadingSystemConfig ||
    isFetchingSumaryReport ||
    isFetchingSystemConfig;
  const [type, setType] = useState<string>('all');
  const { cities, schools } = systemConfig || {};

  const summaryData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {
      todo: { ['68_1']: 0, ['68_2']: 0, ['68_3']: 0 },
      pending: { ['68_1']: 0, ['68_2']: 0, ['68_3']: 0 },
      done: { ['68_1']: 0, ['68_2']: 0, ['68_3']: 0 },
      total: { ['68_1']: 0, ['68_2']: 0, ['68_3']: 0 },
    };

    const grouped = keyBy(sumaryReport ?? {}, (report) => report.school);

    let filteredSchools = Object.values(schools ?? {});
    if (type !== 'all') {
      filteredSchools = filteredSchools.filter((school) => {
        if (type === 'cl') {
          return school.schoolType === 'cl';
        }
        if (type === 'ncl') {
          return school.schoolType !== 'cl';
        }
        if (type === 'nl') {
          return /NLĐL|MNĐL|NTĐL/i.test(school.name);
        }
        return true;
      });
    }

    filteredSchools.forEach((school) => {
      const ward = school.ward;
      const area = get(cities, ['68', 'wards', ward, 'area'], '');
      const schoolReport = grouped[school.schoolCode];
      const totalReport = school.type === 'mn' ? 8 : 2;
      if ((schoolReport?.status?.done?.length ?? 0) === totalReport) {
        data.done[area] += 1;
      } else if ((schoolReport?.status?.pending?.length ?? 0) > 0) {
        data.pending[area] += 1;
      } else {
        data.todo[area] += 1;
      }
      data.total[area] += 1;
    });

    Object.entries(data).forEach(([key, value]) => {
      data[key]['total'] = Object.values(value).reduce(
        (acc, curr) => acc + curr,
        0
      );
    });

    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumaryReport, schools, type]);

  return (
    <div className="mt-4">
      {isLoading ? <Loading /> : null}
      <div className="flex justify-end gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="province">Loại hình trường</Label>
          <Select value={type} onValueChange={(value) => setType(value)}>
            <SelectTrigger className="w-40 mb-2">
              <SelectValue placeholder="Chọn loại hình trường" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={'all'} value={'all'}>
                Tất cả
              </SelectItem>
              <SelectItem key={'mn'} value={'cl'}>
                Trường CL
              </SelectItem>
              <SelectItem key={'nl'} value={'ncl'}>
                Trường NCL
              </SelectItem>
              <SelectItem key={'nl'} value={'nl'}>
                Nhóm lớp ĐL
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-center text-white border">STT</TableHead>
            <TableHead className="text-center text-white border">
              Tiêu chí
            </TableHead>
            <TableHead className="text-center text-white border">
              Đắk Nông
            </TableHead>
            <TableHead className="text-center text-white border">
              Lâm Đồng
            </TableHead>
            <TableHead className="text-center text-white border">
              Bình Thuận
            </TableHead>
            <TableHead className="text-center text-white border">
              Tổng
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mapping.map((item, index) => (
            <TableRow key={item.key}>
              {item.key === 'total' ? (
                <TableCell colSpan={2} className="text-center border font-bold">
                  Tổng số trường
                </TableCell>
              ) : (
                <>
                  <TableCell className="text-center border">
                    {index + 1}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                </>
              )}
              <TableCell className="text-center border">
                {summaryData[item.key]['68_1']}
              </TableCell>
              <TableCell className="text-center border">
                {summaryData[item.key]['68_2']}
              </TableCell>
              <TableCell className="text-center border">
                {summaryData[item.key]['68_3']}
              </TableCell>
              <TableCell className="text-center border">
                {formatNumber(summaryData[item.key]['total'])}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
