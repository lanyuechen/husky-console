import type { ProColumns } from '@ant-design/pro-table';

export interface TableListProps<T> {
  title?: string;
  columns: ProColumns<T>[];
  options: string[];
  service: any;
}