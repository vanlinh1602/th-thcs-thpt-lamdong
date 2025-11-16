import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { toast } from 'sonner';

import { translations } from '@/locales/translations';
import formatError from '@/utils/formatError';

import {
  createReport,
  deleteReport,
  getChildReportData,
  getReport,
  getReportConfig,
  getReportSchema,
  getSumaryReport,
  getUserReports,
  updateChildReportData,
} from '../api';
import { ChildReport, UserReport } from '../type';

// Reports Schema

export const useReportConfig = (reportType: string) => {
  return useQuery({
    queryKey: ['reports', 'config', reportType],
    queryFn: () => getReportConfig(reportType),
    enabled: !!reportType,
    staleTime: 1000 * 60 * 60 * 0.5, // 0.5 hour
  });
};

export const useReportSchema = (reportType: string, reportKey: string) => {
  return useQuery({
    queryKey: ['reports', 'schema', reportType, reportKey],
    queryFn: () => getReportSchema(reportType, reportKey),
    enabled: !!reportType && !!reportKey,
    staleTime: 1000 * 60 * 60 * 0.5, // 0.5 hour
  });
};

// Reports Data
export const useUserReports = (id?: string) => {
  return useQuery({
    queryKey: ['reports', 'user', id],
    queryFn: () => getUserReports(),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 0.5, // 0.5 hour
  });
};

export const useSumaryReport = () => {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: () => getSumaryReport(),
    staleTime: 1000 * 60 * 60 * 0.5, // 0.5 hour
  });
};

export const useReport = (reportId?: string) => {
  return useQuery({
    queryKey: ['reports', 'data', reportId],
    queryFn: () => getReport(reportId || ''),
    enabled: !!reportId,
    staleTime: 1000 * 60 * 60 * 0.5, // 0.5 hour
  });
};

export const useChildReportData = (reportId: string, reportKey: string) => {
  return useQuery({
    queryKey: ['reports', 'data', reportId, reportKey],
    queryFn: () => getChildReportData(reportId, reportKey),
    enabled: !!reportId && !!reportKey,
    staleTime: 1000 * 60 * 60 * 0.5, // 0.5 hour
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (report: Partial<UserReport>) => createReport(report),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: any) => {
      toast.error(t(translations.errors.title), {
        description: formatError(error),
      });
    },
  });
};

export const useUpdateChildReportData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportData: Partial<ChildReport>) =>
      updateChildReportData(reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'data'] });
    },
    onError: (error: any) => {
      toast.error(t(translations.errors.title), {
        description: formatError(error),
      });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'user'] });
    },
    onError: (error: any) => {
      toast.error(t(translations.errors.title), {
        description: formatError(error),
      });
    },
  });
};
