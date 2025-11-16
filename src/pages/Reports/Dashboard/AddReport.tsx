import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Loading, SearchSelect } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateReport } from '@/features/reports/hooks';
import { useSystemConfig } from '@/features/system/hooks';
import { SCHOOL_LEVELS } from '@/lib/config';
import formatError from '@/utils/formatError';

type Props = {
  onClose: () => void;
};

type Info = {
  province: string;
  area?: string;
  ward?: string;
  school?: string;
  schoolLevel?: string;
};

export const AddReport = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const { data: systemConfig } = useSystemConfig();
  const { cities, schools, areas } = systemConfig || {};

  const { mutateAsync: createReport } = useCreateReport();

  const [info, setInfo] = useState<Info>({
    province: '68',
  });
  const [loading, setLoading] = useState(false);

  const { wardsOptions } = useMemo(() => {
    // const provinces = Object.entries(cities || {}).map(([key, value]) => ({
    //   label: value.name,
    //   value: key,
    // }));
    // if (!info.province) {
    //   return {
    //     provincesOptions: provinces,
    //     wardsOptions: [],
    //   };
    // }
    return {
      // provincesOptions: provinces,
      wardsOptions: Object.entries(get(cities, [info.province, 'wards'], {}))
        .filter(([, value]) => value.area === info.area)
        .map(([key, value]) => ({
          label: value.name,
          value: key,
        })),
    };
  }, [info.province, info.area, cities]);

  const schoolOptions = useMemo(() => {
    if (!info.ward) return [];
    return Object.entries(schools || {})
      .filter(
        ([, value]) =>
          value.ward === info.ward && value.type === info.schoolLevel
      )
      .map(([key, value]) => ({
        label: value.name,
        value: key,
      }));
  }, [schools, info.ward, info.schoolLevel]);

  const handleCreateReport = async () => {
    try {
      setLoading(true);
      const school = schools?.[info.school!];
      if (!school) {
        toast.warning('Trường không tồn tại');
        return;
      }
      const report = await createReport({
        province: info.province,
        ward: info.ward,
        school: info.school,
        reportType: school.type,
      });
      navigate(`/reports/${report.id}`);
      toast.success('Thêm báo cáo thành công');
      onClose();
    } catch (error: any) {
      toast.error('Thêm báo cáo lỗi', {
        description: formatError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      {loading ? <Loading /> : null}
      <DialogContent>
        <DialogHeader>
          <div className="text-xl font-bold">Thêm báo cáo</div>
        </DialogHeader>
        <div className="space-y-4">
          <div id="select_area" className="grid gap-2">
            <Label htmlFor="province">
              Chọn Khu Vực
              <span className="text-red-500">*</span>
            </Label>
            <Select
              key="area"
              value={info.area}
              onValueChange={(value) =>
                setInfo({ ...info, area: value, ward: '', school: '' })
              }
            >
              <SelectTrigger className=" bg-white">
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(areas?.[info.province]?.merged || {}).map(
                  ([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div id="select_ward" className="grid gap-2">
            <Label htmlFor="ward">
              Phường/Xã
              <span className="text-red-500">*</span>
            </Label>
            <SearchSelect
              className="w-full"
              placeholder="Chọn phường xã"
              value={
                info.ward
                  ? {
                      label: get(
                        cities,
                        [info.province, 'wards', info.ward, 'name'],
                        info.ward
                      ),
                      value: info.ward,
                    }
                  : null
              }
              options={wardsOptions}
              onChange={(value) =>
                setInfo({ ...info, ward: value?.value, school: undefined })
              }
            />
          </div>
          <div id="select_area" className="grid gap-2">
            <Label htmlFor="province">
              Cấp bậc học
              <span className="text-red-500">*</span>
            </Label>
            <Select
              key="area"
              value={info.schoolLevel}
              onValueChange={(value) =>
                setInfo({ ...info, schoolLevel: value, school: '' })
              }
            >
              <SelectTrigger className=" bg-white">
                <SelectValue placeholder="Chọn cấp bậc học" />
              </SelectTrigger>
              <SelectContent>
                {SCHOOL_LEVELS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div id="select_school" className="grid gap-2">
            <Label htmlFor="schoolName">
              Tên trường
              <span className="text-red-500">*</span>
            </Label>
            <SearchSelect
              className="w-full"
              placeholder="Chọn trường..."
              value={
                info.school
                  ? {
                      label: get(schools, [info.school, 'name'], info.school),
                      value: info.school,
                    }
                  : null
              }
              options={schoolOptions}
              onChange={(value) => setInfo({ ...info, school: value?.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              id="btn-close-create-report"
              size="sm"
              variant="destructive"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              id="btn-create-report"
              size="sm"
              onClick={() => {
                if (!info.ward || !info.school) {
                  toast.warning('Vui lòng chọn đầy đủ các thông tin bắt buộc');
                  return;
                }
                handleCreateReport();
              }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
