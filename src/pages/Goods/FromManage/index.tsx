import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { addGoodsFrom, getGoodsFrom } from '@/services/ant-design-pro/goods-from';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps, ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.GoodsFromListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addGoodsFrom({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重新尝试！');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败，请重新尝试！');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.GoodsFromListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodsFromListItem>();

  const [current, setCurrent] = useState<number>(1);

  // 获取当前页数
  useEffect(() => {
    // console.log('current:', actionRef.current?.pageRef.current);
  }, [])

  // 监听键盘左右按键，切换表格数据
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === 'ArrowLeft') {
  //       if (currentRow) {
  //         const index = data.findIndex((item) => item.id === currentRow.id);
  //         if (index > 0) {
  //           setCurrentRow(data[index - 1]);
  //         }
  //       }
  //     } else if (e.key === 'ArrowRight') {
  //       if (currentRow) {
  //         const index = data.findIndex((item) => item.id === currentRow.id);
  //         if (index < data.length - 1) {
  //           setCurrentRow(data[index + 1]);
  //         }
  //       }
  //     }
  //   };
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // })


  const columns: ProColumns<API.GoodsFromListItem>[] = [
    {
      title: '厂商姓名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      valueType: 'textarea',
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      123
      <ProTable<API.GoodsFromListItem, API.PageParams>
        pagination={{
          pageSize: 10,
          current,
          showQuickJumper: true,
        }}
        onDataSourceChange={(data) => {
          console.log(data);
          // setCurrent(data.current);
        }}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 添加厂商信息
          </Button>,
        ]}
        request={getGoodsFrom}
        columns={columns}
        defaultSize="large"
      />
      <ModalForm
        title="添加厂商信息"
        width="400px"
        layout="horizontal"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.GoodsFromListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <div style={{ marginTop: '20px' }}></div>
        <ProFormText
          rules={[{ required: true, message: '请输入厂商姓名' }]}
          width="md"
          name="name"
          label="厂商姓名"
          placeholder="请输入厂商姓名"
        />
        <ProFormText
          rules={[{ required: true, message: '请输入联系方式' }]}
          width="md"
          name="phone"
          label="联系方式"
          placeholder="请输入联系方式"
        />
        <ProFormText
          rules={[{ required: true, message: '请输入联系地址' }]}
          width="md"
          name="address"
          label="联系地址"
          placeholder="请输入联系地址"
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.GoodsFromListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.GoodsFromListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
