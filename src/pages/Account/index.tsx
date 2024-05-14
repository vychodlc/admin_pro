import { getAccount } from '@/services/ant-design-pro/account';
import { addGoodsFrom, updateGoodsFrom } from '@/services/ant-design-pro/goods-from';
import { AlipayCircleOutlined, MoneyCollectOutlined, WechatOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Drawer, Popconfirm, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.AccountListItem) => {
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
 * @param id
 * @param fields
 */
const handleUpdate = async (id: number, fields: Partial<API.AccountListItem>) => {
  const hide = message.loading('正在配置');
  try {
    await updateGoodsFrom({ ...fields, id });
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
 * @en-US Delete node
 * @zh-CN 删除节点
 *
 * @param id
 */
// const handleRemove = async (id: number) => {
//   const hide = message.loading('正在删除');
//   try {
//     await removeGoodsFrom({ id });
//     hide();
//     message.success('删除成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重新尝试！');
//     return false;
//   }
// };

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
  const [currentRow, setCurrentRow] = useState<API.AccountListItem>();
  const [current, setCurrent] = useState<number>(1);

  const columns: ProColumns<API.AccountListItem>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      render: (_, { type }) => {
        return (
          <Tag color="success">
            {type === 'input_pay'
              ? '进货'
              : type === 'output_income'
              ? '出货'
              : type === 'salary'
              ? '工人薪资'
              : '未知'}
          </Tag>
        );
      },
    },
    {
      title: '方式',
      dataIndex: 'method',
      render: (_, { method }) => {
        return (
          <span>
            {method === 'alipay' && (
              <>
                <AlipayCircleOutlined style={{ color: '#226bf3' }} /> 支付宝支付
              </>
            )}
            {method === 'wechat' && (
              <>
                <WechatOutlined style={{ color: '#2aae67' }} /> 微信支付
              </>
            )}
            {method === 'cash' && (
              <>
                <MoneyCollectOutlined style={{ color: '#ff0000' }} /> 现金支付
              </>
            )}
          </span>
        );
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
    },
    {
      title: '交易时间',
      dataIndex: 'created_at',
      valueType: 'textarea',
      render: (_, { created_at }) => {
        return `${created_at?.toString().split('T')[0]} ${
          created_at?.toString().split('T')[1].split('.')[0]
        }`;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        // <a
        //   key="config"
        //   onClick={() => {
        //     setCurrentRow(record);
        //     handleUpdateModalOpen(true);
        //   }}
        // >
        //   修改
        // </a>,
        <Popconfirm
          key="deletePop"
          title="删除交易记录"
          description="你真的确定要删除这个交易记录吗？"
          // onConfirm={async () => {
          //   await handleRemove(record.id);
          //   actionRef.current?.reloadAndRest?.();
          // }}
          onConfirm={() => {
            message.warning('请联系管理员删除');
          }}
          okText="确认"
          cancelText="取消"
        >
          <a key="deletePop">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      pageHeaderRender={false}
      token={{
        paddingBlockPageContainerContent: 10,
      }}
    >
      <ProTable<API.AccountListItem, API.PageParams>
        toolbar={{
          title: <h2>交易管理</h2>,
          settings: [],
        }}
        pagination={{
          pageSize: 10,
          current,
          onChange: (page) => {
            setCurrent(page);
          },
        }}
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     key="primary"
        //     onClick={() => {
        //       handleModalOpen(true);
        //     }}
        //   >
        //     <PlusOutlined /> 添加交易信息
        //   </Button>,
        // ]}
        request={async (params) => {
          const res = await getAccount({ ...params, current, pageSize: 10 });
          return res;
        }}
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
          const success = await handleAdd(value as API.AccountListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        modalProps={{ destroyOnClose: true }}
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
      <ModalForm
        title="修改厂商信息"
        width="400px"
        layout="horizontal"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={{ ...currentRow }}
        onFinish={async (value) => {
          const success = await handleUpdate(currentRow?.id || 1, value as API.AccountListItem);
          if (success) {
            handleUpdateModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        modalProps={{ destroyOnClose: true }}
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
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.AccountListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AccountListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
