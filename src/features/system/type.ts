export type Cities = Record<
  string,
  {
    name: string;
    wards: Record<string, { name: string; area?: string }>;
  }
>;

export type SchoolType = 'tt' | 'cl' | 'dl';

export type School = {
  schoolCode: string;
  name: string;
  schoolType: SchoolType;
  ward: string;
  type: string;
};

export type SystemConfig = {
  cities: Cities;
  schools: Record<string, School>;
  areas: Record<
    string,
    { name: string; merged: Record<string, { name: string }> }
  >;
};

export type FileUploaded = {
  fileName: string;
  url: string;
  path: string;
};
