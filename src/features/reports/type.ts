export type ReportListConfig = {
  name: string;
  reportKey: string;
}[];

export type ReportStatus = 'todo' | 'pending' | 'done';

export type UserReport = {
  id: string;
  province: string;
  ward: string;
  school: string;
  reportType: string;
  updatedAt: number;
  status?: {
    pending: string[];
    done: string[];
  };
  user: string;
};

export type ChildReport = {
  id: string;
  reportId: string;
  reportKey: string;
  status: ReportStatus;
  updatedAt: number;
  data: any;
};
