import { get, groupBy, size } from 'lodash';
import { useMemo } from 'react';

import { Loading } from '@/components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSystemConfig } from '@/features/system/hooks';
import { formatNumber } from '@/lib/common';

export const ThongKeChung = () => {
  const {
    data: systemConfig,
    isLoading: isLoadingSystemConfig,
    isFetching: isFetchingSystemConfig,
  } = useSystemConfig();
  const { cities, schools } = systemConfig || {};
  const isLoading = isLoadingSystemConfig || isFetchingSystemConfig;
  const sumary = useMemo(() => {
    const totalNL = Object.values(schools ?? {}).filter(
      (school) => school.type === 'nl'
    ).length;
    const grouded = Object.entries(groupBy(schools ?? {}, 'ward')).sort(
      (a, b) => b[1].length - a[1].length
    );
    const maxWard = grouded[0][0];
    const minWard = grouded[grouded.length - 1][0];
    return {
      totalNL,
      maxWard,
      minWard,
    };
  }, [schools]);

  return (
    <div className="mt-4">
      {isLoading ? <Loading /> : null}
      <Table className="border border-gray-200 rounded">
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-center text-white border">STT</TableHead>
            <TableHead className="text-center text-white border">
              Thông tin chung
            </TableHead>
            <TableHead className="text-center text-white border">
              Tổng số
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell className="text-center border">1</TableCell>
            <TableCell className="border">Tồng số phường/xã</TableCell>
            <TableCell className="text-center border">
              {size(cities?.[68]?.wards ?? {})}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center border">2</TableCell>
            <TableCell className="border">Tổng số đơn vị</TableCell>
            <TableCell className="text-center border">
              {formatNumber(Object.keys(schools ?? {}).length)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center border">3</TableCell>
            <TableCell className="border">Tổng số nhóm lớp</TableCell>
            <TableCell className="text-center border">
              {formatNumber(sumary.totalNL)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center border">4</TableCell>
            <TableCell className="border">
              Phường/xã có nhiều đơn vị mầm non nhất
            </TableCell>
            <TableCell className="text-center border">
              {get(
                cities,
                ['68', 'wards', sumary.maxWard, 'name'],
                sumary.maxWard
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center border">5</TableCell>
            <TableCell className="border">
              Phường/xã có ít đơn vị mầm non nhất
            </TableCell>
            <TableCell className="text-center border">
              {get(
                cities,
                ['68', 'wards', sumary.minWard, 'name'],
                sumary.minWard
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
