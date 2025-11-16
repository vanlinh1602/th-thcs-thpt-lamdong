import { useQueryClient } from '@tanstack/react-query';
import { get, groupBy } from 'lodash';
import { Edit, LogOut, Plus, RefreshCcw, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import { Loading } from '@/components';
import { Tutorial } from '@/components/Tutorial';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReportStatusList } from '@/features/reports/components';
import { useDeleteReport, useUserReports } from '@/features/reports/hooks';
import { useSystemConfig } from '@/features/system/hooks';
import { useUserStore } from '@/features/user/hooks';
import { useModal } from '@/hooks/ConfirmModal';
import { auth } from '@/services/firebase';
import formatError from '@/utils/formatError';

import { AddReport } from './AddReport';

export default function ReportsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { confirm } = useModal();

  const { user, handleLogout } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      handleLogout: state.logout,
    }))
  );

  const {
    data: systemConfig,
    isLoading: isLoadingSystemConfig,
    isFetching: isFetchingSystemConfig,
  } = useSystemConfig();
  const {
    data: reports,
    isLoading: isLoadingReports,
    isFetching: isFetchingReports,
  } = useUserReports(user?._id);
  const { mutateAsync: deleteReport } = useDeleteReport();

  const { cities, schools } = systemConfig || {};
  const isLoading =
    isLoadingSystemConfig ||
    isLoadingReports ||
    isFetchingSystemConfig ||
    isFetchingReports;

  const groupedReports = useMemo(() => {
    return groupBy(reports, 'ward');
  }, [reports]);

  const [addReport, setAddReport] = useState<boolean>();
  const [handling, setHandling] = useState(false);

  const handleDeleteReport = async (reportId: string) => {
    try {
      const confirmed = await new Promise((resolve) =>
        confirm({
          title: 'Xác nhận',
          description: 'Bạn có chắc chắn muốn xóa báo cáo này không?',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        })
      );
      if (!confirmed) return;

      setHandling(true);
      await deleteReport(reportId);
      toast.success('Xóa báo cáo thành công');
    } catch (error: any) {
      toast.error('Xóa báo cáo lỗi', {
        description: formatError(error),
      });
    } finally {
      setHandling(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-background">
      {isLoading || handling ? <Loading /> : null}
      {addReport ? <AddReport onClose={() => setAddReport(false)} /> : null}
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground text-balance text-center">
            Danh sách báo cáo
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Email: {user?.email}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-2 pb-24 space-y-2">
        <div className="flex justify-between items-center">
          <Tutorial type="taomoi" />
          <Button
            className="bg-red-500 text-white"
            onClick={async () => {
              setHandling(true);
              try {
                await auth.signOut();
                await handleLogout();
                await queryClient.clear();
                navigate('/');
              } catch (error) {
                toast.error('Đăng xuất lỗi', {
                  description: formatError(error),
                });
              } finally {
                setHandling(false);
              }
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
        {/* Reports Table */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <h2 className="text-lg font-semibold">
                Tổng số: {Object.keys(reports || {}).length}
              </h2>
              <div className="space-x-2">
                <Button
                  id="refresh-reports"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    queryClient.invalidateQueries();
                  }}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Tải lại
                </Button>
                <Button
                  id="create-report"
                  size="sm"
                  onClick={() => setAddReport(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm báo cáo
                </Button>
              </div>
            </div>
            {/* Mobile list */}
            <div className="block md:hidden">
              <div className="space-y-3">
                {Object.entries(reports || {}).map(([key, r], idx) => {
                  const wardName = get(
                    cities,
                    [r.province, 'wards', r.ward, 'name'],
                    r.ward
                  );
                  // const levelName = upperCase(r.reportType || '');
                  const schoolName = get(schools, [r.school, 'name'], r.school);
                  return (
                    <div
                      key={idx}
                      className="rounded-md border border-border bg-card p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Phường/Xã:{' '}
                            </span>
                            <span className="font-medium text-foreground">
                              {wardName}
                            </span>
                          </div>
                          {/* <div>
                            <span className="text-muted-foreground">
                              Loại:{' '}
                            </span>
                            <span className="font-medium text-foreground">
                              {levelName}
                            </span>
                          </div> */}
                          <div className="min-w-0">
                            <span className="text-muted-foreground">
                              Trường:{' '}
                            </span>
                            <span className="font-medium text-foreground break-words">
                              {schoolName}
                            </span>
                          </div>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => navigate(`${key}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-500 text-white"
                              onClick={() => handleDeleteReport(key)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-3 py-2 font-medium">
                      Phường/Xã
                    </th>
                    {/* <th className="text-left px-3 py-2 font-medium">Loại</th> */}
                    <th className="text-left px-3 py-2 font-medium">Trường</th>
                    <th className="text-left px-3 py-2 font-medium">Tiến độ</th>
                    <th className="text-left px-3 py-2 font-medium">
                      Cập nhật
                    </th>
                    <th className="text-left px-3 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedReports || {}).flatMap(
                    ([wardKey, group]) => {
                      const wardName = get(
                        cities,
                        [group[0].province, 'wards', wardKey, 'name'],
                        wardKey
                      );
                      return group.map((r, idx) => {
                        const schoolName = get(
                          schools,
                          [r.school, 'name'],
                          r.school
                        );
                        return (
                          <tr
                            key={`${wardKey}-${r.id}-${idx}`}
                            className="border-b border border-border hover:bg-muted/20"
                          >
                            {idx === 0 ? (
                              <td
                                className="px-3 py-2 whitespace-nowrap border border-border"
                                rowSpan={group.length}
                              >
                                {wardName}
                              </td>
                            ) : null}
                            {/* <td className="px-3 py-2 whitespace-nowrap">
                          {levelName}
                        </td> */}
                            <td className="px-3 py-2 min-w-[240px]">
                              {schoolName}
                            </td>
                            <td className="px-3 py-2 min-w-[240px] space-y-1">
                              <ReportStatusList
                                reportType={r.reportType}
                                statuses={r.status}
                              />
                            </td>
                            <td className="px-3 py-2">
                              {new Date(r?.updatedAt || 0).toLocaleString()}
                            </td>
                            <td>
                              <div className="flex justify-end px-3 py-2 space-x-2 items-center ">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => navigate(`${r.id}`)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-500 text-white"
                                  onClick={() => handleDeleteReport(r.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Xóa
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    }
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
