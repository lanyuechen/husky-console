import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal, Tooltip } from 'antd';
import { FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

import type { TableListProps } from './typings';

const icons = {
  detail: <FileTextOutlined />,
  edit: <FormOutlined />,
  remove: <DeleteOutlined />,
}

export default function<T = any>(props: TableListProps<T>) {
  const { title, options, service } = props;

  const handleOption = (key: any, record: any) => {
    setCurrentRow(record);
    if (key === 'detail') {
      setDetailVisible(true);
    } else if (key === 'edit') {
      setEditModalVisible(true);
    } else if (key === 'remove') {
      handleRemove([currentRow]);
    }
  }

  const prepareOption = (key: any, record: any) => {
    return (
      <Tooltip key={key} title={{detail: '详情', edit: '编辑', remove: '删除'}[key]}>
        <a onClick={() => handleOption(key, record)}>
          {icons[key]}
        </a>
      </Tooltip>
    );
  }

  const handleAdd = async (fields: any) => {
    try {
      await service.create(fields);
      message.success('添加成功');
      setCreateModalVisible(false);
      actionRef.current?.reload?.();
    } catch (error) {
      message.error('添加失败请重试！');
    }
  };

  const handleUpdate = async (fields: any) => {
    try {
      await service.update(currentRow._id ,fields);
      message.success('更新成功');
      setEditModalVisible(false);
      actionRef.current?.reload?.();
    } catch (error) {
      message.error('更新失败请重试！');
    }
  };

  const handleRemove = (selectedRows: any[]) => {
    Modal.confirm({
      title: '删除',
      content: '确认删除',
      onOk: async () => {
        try {
          await service.remove(selectedRows.map((row) => row._id));
          setSelectedRows([]);
          actionRef.current?.reloadAndRest?.();
          message.success('删除成功');
          return true;
        } catch (error) {
          message.error('删除失败请重试！');
          return false;
        }
      }
    });
  };

  const columns: ProColumns<T>[] = [
    ...props.columns,
    {
      title: "操作",
      width: 120,
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => options.map((key: any) => prepareOption(key, record)),
    },
  ];

  /** 新建窗口的弹窗 */
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  return (
    <>
      <ProTable<T, Global.PageParams>
        actionRef={actionRef}
        headerTitle={title}
        rowKey="_id"
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={service.query}
        columns={columns}
        options={{
          fullScreen: true,
          reload: true,
          setting: true,
          density: false,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择<a style={{ fontWeight: 600 }}>{selectedRows.length}</a>项
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={() => handleRemove(selectedRows)}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Modal
        title={'新建'}
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <ProTable<T>
          type="form"
          onSubmit={handleAdd}
          columns={columns}
          form={{
            preserve: false
          }}
        />
      </Modal>

      <Modal
        title={'编辑'}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <ProTable<T>
          type="form"
          onSubmit={handleUpdate}
          columns={columns}
          form={{
            preserve: false,
            initialValues: currentRow,
          }}
        />
      </Modal>

      <Drawer
        width={600}
        visible={detailVisible}
        onClose={() => {
          setCurrentRow(undefined);
          setDetailVisible(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<T>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<T>[]}
          />
        )}
      </Drawer>
    </>
  );
};
