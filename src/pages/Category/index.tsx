import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';

import TableList from '@/components/TableList';
import * as service from './service';

export default () => {
  const columns: ProColumns<Category.Item>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: "描述",
      dataIndex: 'desc',
      valueType: 'textarea',
    },
  ];
  
  return (
    <PageContainer>
      <TableList<Category.Item>
        title="分类管理"
        columns={columns}
        options={['detail', 'edit', 'remove']}
        service={service}
      />
    </PageContainer>
  );
}
