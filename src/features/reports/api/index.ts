import { ReportField } from '@/features/schemas/type';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { ChildReport, ReportListConfig, UserReport } from '../type';

// Reports Schema
export const getReportConfig = async (
  reportType: string
): Promise<ReportListConfig> => {
  const response = await backendService.get<ReportListConfig>(
    `reports-other/config/${reportType}`
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

export const getReportSchema = async (
  reportType: string,
  reportKey: string
): Promise<Record<string, ReportField>> => {
  const response = await backendService.get<Record<string, ReportField>>(
    `reports-other/schema/${reportType}/${reportKey}`
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

// Reports Data
export const getUserReports = async (): Promise<Record<string, UserReport>> => {
  const response = await backendService.get<UserReport[]>(
    '/reports-other/user'
  );
  if (response.kind === 'ok') {
    const result: Record<string, UserReport> = {};
    response.data.forEach((report) => {
      result[report.id] = report;
    });
    return result;
  }
  throw new Error(formatError(response));
};

export const getSumaryReport = async (): Promise<
  Record<string, UserReport>
> => {
  const response = await backendService.get<Record<string, UserReport>>(
    '/reports-other/summary'
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

export const createReport = async (
  userReport: Partial<UserReport>
): Promise<UserReport> => {
  const response = await backendService.post<UserReport>(
    '/reports-other',
    userReport
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

export const getReport = async (reportId: string): Promise<UserReport> => {
  const response = await backendService.get<UserReport>(
    `/reports-other/${reportId}`
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

export const getChildReportData = async (
  reportId: string,
  reportKey: string
): Promise<ChildReport> => {
  const response = await backendService.get<ChildReport>(
    `/reports-other/${reportId}/${reportKey}`
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

export const updateChildReportData = async (
  reportData: Partial<ChildReport>
): Promise<boolean> => {
  const response = await backendService.put<boolean>(
    '/reports-other/child',
    reportData
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};

export const deleteReport = async (reportId: string): Promise<boolean> => {
  const response = await backendService.delete<boolean>(
    `/reports-other/${reportId}`
  );
  if (response.kind === 'ok') {
    return response.data;
  }
  throw new Error(formatError(response));
};
