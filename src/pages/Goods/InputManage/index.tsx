import { getGoodsFrom } from '@/services/ant-design-pro/goods-from';
import { addGoodsInput, getGoodsInput } from '@/services/ant-design-pro/goods-input';
import { addGoodsInputItem } from '@/services/ant-design-pro/goods-input-item';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';

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
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  // const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<API.GoodsInputListItem>();
  const [current, setCurrent] = useState<number>(1);

  const columns: ProColumns<API.GoodsInputListItem>[] = [
    {
      title: '来源',
      dataIndex: 'from_name',
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         setCurrentRow(entity);
      //         setShowDetail(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
    },
    {
      title: '价值',
      dataIndex: 'cost',
      valueType: 'money',
    },
    {
      title: '支付记录',
      dataIndex: 'pay_log',
      valueType: 'textarea',
    },
    {
      title: '结余状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, { status }) => {
        return (
          <Tag color={'red'} key={status ? '1' : '0'}>
            {status ? '已结清' : '未结清'}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // render: (_, record) => [
      // <a
      //   key="config"
      //   onClick={() => {
      //     setCurrentRow(record);
      //     handleUpdateModalOpen(true);
      //   }}
      // >
      //   修改
      // </a>,
      // <Popconfirm
      //   key="deletePop"
      //   title="Delete the task"
      //   description="Are you sure to delete this task?"
      //   // onConfirm={async () => {
      //   //   await handleRemove(record.id);
      //   //   actionRef.current?.reloadAndRest?.();
      //   // }}
      //   onConfirm={() => {
      //     message.warning('请联系管理员删除');
      //   }}
      //   okText="Yes"
      //   cancelText="No"
      // >
      //   <a key="deletePop">删除</a>
      // </Popconfirm>,
      // ],
    },
  ];

  const [goodsFromList, setGoodsFromList] = useState<any[]>([]);

  useEffect(() => {
    getGoodsFrom({}).then((res) => {
      setGoodsFromList(res.data || []);
    });
  }, []);

  return (
    <PageContainer
      pageHeaderRender={false}
      token={{
        paddingBlockPageContainerContent: 10,
      }}
    >
      <ProTable<API.GoodsInputListItem, API.PageParams>
        toolbar={{
          title: <h2>进货订单管理</h2>,
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 添加进货订单信息
          </Button>,
        ]}
        request={async (params) => {
          const res = await getGoodsInput({ ...params, current, pageSize: 10 });
          return res;
        }}
        columns={columns}
        defaultSize="large"
      />
      <CreateForm
        onFinish={async (value) => {
          const from_item = goodsFromList.find((item) => item.id === value.from_id);
          const submitForm = {
            from_id: from_item?.id,
            from_name: from_item?.name,
            from_address: from_item?.address,
            from_phone: from_item?.phone,
            created_at: value.created_at,
            cost: value.table?.reduce((pre: number, item: any) => {
              return (pre || 0) + (item.price || 0) * (item.amount || 0) * (item.unit || 0);
            }, 0),
            pay_log: '',
            pay: 0,
            status: 0,
          };
          const { success, data } = await addGoodsInput(submitForm);
          if (success) {
            console.log(data);

            const res = await addGoodsInputItem({
              table: value.table?.map((item: any) => ({
                ...item,
                order_id: data?.id,
                state: value.state,
                created_at: value.created_at,
              })),
            });
            if (res.success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
        controlCreateModelVisible={(flag?: boolean) => {
          handleModalOpen(flag || false);
        }}
        createModalOpen={createModalOpen}
        values={{}}
      />
      {/* <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.GoodsInputListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.GoodsInputListItem>[]}
          />
        )}
      </Drawer> */}
    </PageContainer>
  );
};

export default TableList;
