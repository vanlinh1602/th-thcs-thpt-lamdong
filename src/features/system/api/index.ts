import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Cities, FileUploaded, School, SystemConfig } from '../type';

export const getSystemConfig = async (): Promise<SystemConfig> => {
  const [cities, schools, area] = await Promise.all([
    backendService.get<Cities>('resources/cities.json'),
    backendService.get<Record<string, School>>('resources/schools-other.json'),
    backendService.get<
      Record<string, { name: string; merged: Record<string, { name: string }> }>
    >('resources/areas.json'),
  ]);

  const config: SystemConfig = {
    cities: {},
    schools: {},
    areas: {},
  };
  if (cities.kind === 'ok' && schools.kind === 'ok' && area.kind === 'ok') {
    config.cities = cities.data;
    config.schools = schools.data;
    config.areas = area.data;
    return config;
  }
  throw new Error(
    formatError(cities) || formatError(schools) || formatError(area)
  );
};

export const uploadFile = async (
  file: File,
  fileName: string,
  path: string,
  uploadType: 'user' | 'report' = 'user'
): Promise<FileUploaded | null> => {
  const response = await backendService.upload<FileUploaded>(
    'files/upload',
    file,
    {
      folder: path,
      fileName,
      uploadType,
    }
  );
  if (response.kind === 'ok') {
    return response.data ?? null;
  }
  throw new Error(formatError(response));
};
