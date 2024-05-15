import { getAccount } from '@/services/ant-design-pro/account';
import { AlipayCircleOutlined, MoneyCollectOutlined, WechatOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProFormSelect, ProTable } from '@ant-design/pro-components';
import { Popconfirm, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
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
      renderFormItem() {
        return (
          <ProFormSelect
            options={[
              { label: '进货', value: 'input_pay' },
              { label: '出货', value: 'output_income' },
              { label: '工人薪资', value: 'salary' },
            ]}
          />
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
      renderFormItem() {
        return (
          <ProFormSelect
            options={[
              { label: '支付宝支付', value: 'alipay' },
              { label: '微信支付', value: 'wechat' },
              { label: '现金支付', value: 'cash' },
            ]}
          />
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
      valueType: 'date',
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
          labelWidth: 'auto',
          searchGutter: 5,
          span: 4,
        }}
        form={{
          size: 'small',
          style: {
            paddingTop: 10,
            paddingBottom: 10,
          },
        }}
        request={async (params) => {
          const res = await getAccount({ ...params, current, pageSize: 10 });
          return res;
        }}
        columns={columns}
        defaultSize="small"
      />
    </PageContainer>
  );
};

export default TableList;
