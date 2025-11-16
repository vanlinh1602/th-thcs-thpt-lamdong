import { cloneDeep, get, set } from 'lodash';
import { Save, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import { Loading } from '@/components';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { getChildReportData } from '@/features/reports/api';
import { ReportStatusBadge } from '@/features/reports/components';
import {
  useChildReportData,
  useReport,
  useReportSchema,
  useUpdateChildReportData,
} from '@/features/reports/hooks';
import { ReportField } from '@/features/schemas/type';
import { uploadFile } from '@/features/system/api';
import { useUserStore } from '@/features/user/hooks';

import { FormRender } from '../FormRender';

type Props = {
  reportName: string;
  reportId: string;
  reportKey: string;
};

export const RenderReport = ({ reportName, reportId, reportKey }: Props) => {
  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const {
    data: report,
    isLoading: isLoadingReport,
    isFetching: isFetchingReport,
  } = useReport(reportId);
  const {
    data: childReport,
    isLoading: isLoadingChildReport,
    isFetching: isFetchingChildReport,
  } = useChildReportData(reportId, reportKey);

  const {
    data: reportSchema,
    isLoading: isLoadingReportSchema,
    isFetching: isFetchingReportSchema,
  } = useReportSchema(report?.reportType || '', reportKey);
  const isLoading =
    isLoadingReport ||
    isFetchingReport ||
    isLoadingChildReport ||
    isFetchingChildReport ||
    isLoadingReportSchema ||
    isFetchingReportSchema;

  const { mutateAsync: updateChildReportData } = useUpdateChildReportData();

  // const hasData = useMemo(() => {
  //   return reportKey === 'kiemdinh' && childReport?.status === 'done';
  // }, [childReport?.status, reportKey]);

  const [activeForm, setActiveForm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFormData = (path: string, value: string | number) => {
    const newData = cloneDeep(formData);

    if (reportKey === 'kiemdinh') {
      if (
        ['congNhanCapDo.thongTin', 'congNhanTruongChuan.thongTin'].includes(
          path
        )
      ) {
        const chuaCo = get(
          formData,
          path.replace('.thongTin', '.chuaCo'),
          true
        );
        if (chuaCo) {
          const name = path.includes('congNhanCapDo')
            ? 'Công nhận cấp độ kiểm định chất lượng quốc gia'
            : 'Công nhận trường chuẩn quốc gia';
          toast.error(
            `Để thêm số lần vui lòng bỏ chọn "Trường chưa có ${name}"`
          );
          return;
        }
      }

      if (
        ['congNhanCapDo.chuaCo', 'congNhanTruongChuan.chuaCo'].includes(path)
      ) {
        if (value) {
          set(newData, path.replace('.chuaCo', '.thongTin'), []);
        }
      }
    }
    set(newData, path, value);
    setFormData(newData);
  };

  const initFormData = async () => {
    try {
      setLoading(true);
      if (!childReport) return;
      const data = cloneDeep(childReport?.data || {});
      const truongLopTreData = await getChildReportData(
        reportId,
        'TruongLopTre'
      );
      const totalTre = get(truongLopTreData, ['data', 'info', 'tongSoTre'], 0);
      set(data, 'info.tongSoTre', totalTre);
      setFormData(data);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childReport?.data) {
      const data = cloneDeep(childReport?.data);
      setFormData(data);
    }
    if (reportKey === 'CoSoVatChat') {
      initFormData();
    }
    return () => {
      setFormData({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childReport?.data, reportKey]);

  useEffect(() => {
    setActiveForm(Object.keys(reportSchema ?? {})[0] || '');
    return () => {
      setActiveForm('');
    };
  }, [reportSchema, reportKey]);

  const handleProcessData = async (
    fields: Record<string, ReportField>,
    data: Record<string, any>,
    specialKey = ''
  ): Promise<Record<string, any>> => {
    const newData = cloneDeep(data) ?? {};
    await Promise.all(
      Object.entries(fields).map(async ([key, field]) => {
        if (field.fields) {
          newData[key] = await handleProcessData(
            field.fields,
            newData?.[key] ?? {},
            key
          );
        }
        const value = get(newData, key);
        if (field.type === 'file' && value?.file) {
          const newFileName = [specialKey, user?._id].filter(Boolean).join('_');
          const uploadPath = `${value.path}/${reportId}/kiemdinh`;
          const uploaded = await uploadFile(
            value.file,
            newFileName,
            uploadPath
          );
          if (uploaded) {
            newData[key] = {
              fileName: value.fileName,
              url: uploaded.url,
            };
          }
        }
        if (field.type === 'allowAdd') {
          const processedData = await Promise.all(
            (value || []).map(async (item: any, index: number) => {
              return await handleProcessData(
                field.config.fields || {},
                item,
                `${field.key}_${index}`
              );
            })
          );
          newData[key] = processedData;
        }
        if (field.type === 'summary') {
          let result = 0;
          if (field.config?.divideFields) {
            result = Number(get(formData, field.config.divideFields[0], 0));
            const newArray = field.config.divideFields.slice(1);
            newArray.forEach((f) => {
              result = result / Number(get(formData, f, 0));
            });
          }
          if (field.config?.summaryFields) {
            const summaryFields = field.config?.summaryFields || [];
            result = summaryFields.reduce((acc, f) => {
              return acc + Number(get(formData, f, 0));
            }, 0);
          }
          newData[key] = result;
        }
      })
    );
    return newData;
  };

  const handleSave = async (temporary = false) => {
    try {
      setLoading(true);
      const processedData = await handleProcessData(
        reportSchema ?? {},
        formData as Record<string, any>
      );
      await updateChildReportData({
        reportId: reportId || '',
        reportKey: reportKey || '',
        data: processedData,
        status: temporary ? 'pending' : 'done',
      });
      toast.success('Lưu thành công');
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading || isLoading ? <Loading /> : null}
      <div className="flex flex-wrap justify-between items-center py-2 mb-2">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold">{reportName}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">
              Trạng thái báo cáo
            </span>
            <ReportStatusBadge status={childReport?.status || 'todo'} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <>
            <Button
              id="btn-save-temporary"
              size="sm"
              onClick={() => handleSave(true)}
            >
              <Save className="h-4 w-4" />
              Lưu Tạm
            </Button>
            <Button
              id="btn-send-report"
              size="sm"
              onClick={() => handleSave(false)}
              className="bg-emerald-500 hover:bg-emerald-500/90 text-green-500-foreground shadow-sm text-white"
            >
              <Send className="h-4 w-4" />
              Gửi
            </Button>
          </>
        </div>
      </div>
      <div>
        {Object.keys(reportSchema ?? {}).length > 1 ? (
          <div id="child-reports-list">
            <div className="text-base font-bold text-muted-foreground">
              Danh sách các mẫu
            </div>
            <ButtonGroup className="flex-wrap">
              {Object.entries(reportSchema ?? {}).map(
                ([sectionKey, section]) => (
                  <Button
                    variant={activeForm === sectionKey ? 'default' : 'outline'}
                    onClick={() => setActiveForm(sectionKey)}
                    key={sectionKey}
                    value={sectionKey}
                  >
                    {section.name}
                  </Button>
                )
              )}
            </ButtonGroup>
          </div>
        ) : null}
        <div id="form-input" className="mt-2 relative">
          {activeForm && (
            <FormRender
              schema={reportSchema?.[activeForm] as ReportField}
              formData={formData as Record<string, any>}
              onChange={(path, value) => {
                updateFormData(`${path}`, value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
