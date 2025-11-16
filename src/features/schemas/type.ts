export type TableConfig = {
  title?: string;
  cols: {
    name: string;
    key: string;
    type: 'text' | 'number' | 'dropdown';
  }[];
  rows: {
    name: string;
    key: string;
  }[];
};

export type DropdownConfig = {
  highlight?: boolean;
  options: {
    label: string;
    value: string;
  }[];
};

export type AllowAddConfig = {
  headerWithIndex?: string;
  showTotal?: boolean;
  max?: number;
  fields: Record<string, ReportField>;
};

export type SummaryConfig = {
  summaryFields: string[];
  divideFields?: string[];
  footer?: string;
};

export type AutoRowConfig = {
  label: string;
  fields: Record<string, ReportField>;
};

export type FileConfig = {
  path: string;
  accept: string;
};

export type MultiSelectConfig = {
  options: {
    label: string;
    value: string;
  }[];
};

type ConfigMap = {
  table: TableConfig;
  dropdown: DropdownConfig;
  allowAdd: AllowAddConfig;
  summary: SummaryConfig;
  autoRow: AutoRowConfig;
  file: FileConfig;
  multiSelect: MultiSelectConfig;
};

type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'dropdown'
  | 'table'
  | 'checkbox'
  | 'allowAdd'
  | 'summary'
  | 'autoRow'
  | 'file'
  | 'date'
  | 'group'
  | 'multiSelect';

type BaseField = {
  key: string;
  name: string;
  inline?: boolean;
  required?: boolean;
  fields: Record<string, ReportField>;
};

export type ReportField<T extends FieldType = FieldType> =
  T extends keyof ConfigMap
    ? BaseField & { type: T } & { config: ConfigMap[T] }
    : BaseField & { type: T };
