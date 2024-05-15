import { addAccount } from '@/services/ant-design-pro/account';
import { getGoodsFrom } from '@/services/ant-design-pro/goods-from';
import {
  addGoodsOutput,
  getGoodsOutput,
  updateGoodsOutput,
} from '@/services/ant-design-pro/goods-output';
import { addGoodsOutputItem } from '@/services/ant-design-pro/goods-output-item';
import {
  AlipayCircleOutlined,
  MoneyCollectOutlined,
  PlusOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popover, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import AddPayForm from './components/AddPayForm';
import CreateForm from './components/CreateForm';
import DetailDrawer from './components/DetailDrawer';

const getSum = (pay_log: string) => {
  const pay_log_list = pay_log?.split('\n').filter((item) => item !== '') || [];
  return pay_log_list.reduce((pre: number, item: string) => {
    const jsonItem = JSON.parse(item);
    return Math.floor((pre + parseFloat(jsonItem.amount)) * 100) / 100;
  }, 0);
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [payModalOpen, handlePayModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodsOutputListItem>();
  const [current, setCurrent] = useState<number>(1);

  const [goodsToList, setGoodsToList] = useState<any[]>([]);
  const columns: ProColumns<API.GoodsOutputListItem>[] = [
    {
      title: '去向',
      dataIndex: 'to_name',
      align: 'center',
      valueType: 'select',
      valueEnum: goodsToList.reduce((pre, item) => {
        return {
          ...pre,
          [item.name]: { text: item.name },
        };
      }, {}),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
      align: 'center',
    },
    {
      title: '价值',
      dataIndex: 'cost',
      valueType: 'money',
      align: 'center',
    },
    {
      title: '支付记录',
      align: 'center',
      dataIndex: 'pay_log',
      valueType: 'textarea',
      render: (_, { pay_log }) => {
        const pay_log_list = pay_log?.split('\n').filter((item) => item !== '') || [];
        const content = (
          <div>
            {pay_log_list.map((item, index) => {
              const jsonItem = JSON.parse(item);
              return (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <>
                    {jsonItem.method === 'alipay' && (
                      <AlipayCircleOutlined style={{ color: '#226bf3' }} />
                    )}
                    {jsonItem.method === 'wechat' && (
                      <WechatOutlined style={{ color: '#2aae67' }} />
                    )}
                    {jsonItem.method === 'cash' && (
                      <MoneyCollectOutlined style={{ color: '#ff0000' }} />
                    )}
                  </>
                  <span>{jsonItem.amount} 元 </span>
                  <span>{jsonItem.created_at}</span>
                </div>
              );
            })}
          </div>
        );
        return (
          <Popover content={content} title="交易项">
            {pay_log_list.map((item, index) => {
              const jsonItem = JSON.parse(item);
              return (
                <Tag icon={<MoneyCollectOutlined />} color="success" key={index}>
                  {jsonItem.amount}
                </Tag>
              );
            })}
            {pay_log_list.length === 0 && <Tag>暂无支付记录</Tag>}
          </Popover>
        );
      },
      search: false,
    },
    {
      title: '结余状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, { pay_log, cost = 0 }) => {
        const hasPay = getSum(pay_log || '');
        const rest = cost - hasPay;
        return (
          <>
            {rest > 0 && <Tag color="red">未结清：{rest}</Tag>}
            {rest <= 0 && <Tag color="success">已结清</Tag>}
          </>
        );
      },
      valueType: 'select',
      valueEnum: {
        0: { text: '未结清' },
        1: { text: '已结清' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const optList = [
          <a
            key="config"
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            详细
          </a>,
        ];
        if (record.status === false) {
          optList.push(
            <a
              key="config"
              onClick={() => {
                setCurrentRow(record);
                handlePayModalOpen(true);
              }}
            >
              支付
            </a>,
          );
        }
        return optList;
      },
    },
  ];

  useEffect(() => {
    getGoodsFrom({ type: 'go' }).then((res) => {
      setGoodsToList(res.data || []);
    });
  }, []);

  return (
    <PageContainer
      pageHeaderRender={false}
      token={{
        paddingBlockPageContainerContent: 10,
      }}
    >
      <ProTable<API.GoodsOutputListItem, API.PageParams>
        toolbar={{
          title: <h2>发货订单管理</h2>,
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
          searchGutter: 10,
          span: 4,
        }}
        form={{
          size: 'small',
          style: {
            paddingTop: 10,
            paddingBottom: 10,
          },
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 添加发货订单信息
          </Button>,
        ]}
        request={async (params) => {
          const res = await getGoodsOutput({ ...params, current, pageSize: 10 });
          console.log('reslc', res);

          return res;
        }}
        columns={columns}
        defaultSize="small"
      />
      <CreateForm
        onFinish={async (value) => {
          const to_item = goodsToList.find((item) => item.id === value.to_id);
          const submitForm = {
            to_id: to_item?.id,
            to_name: to_item?.name,
            to_address: to_item?.address,
            to_phone: to_item?.phone,
            created_at: value.created_at,
            cost: value.table?.reduce((pre: number, item: any) => {
              return (pre || 0) + (item.price || 0) * (item.amount || 0) * (item.unit || 0);
            }, 0),
            count: value.table?.reduce((pre: number, item: any) => {
              return (pre || 0) + (item.amount || 0);
            }, 0),
            pay_log: '',
            handler_id: value.handler_id,
            handler_name: [{ name: '朱兵', id: 1 }].find((item) => item.id === value.handler_id)
              ?.name,
            driver: value.driver_name + ',' + value.driver_phone + ',' + value.driver_car_number,
            status: 0,
          };
          console.log('json', JSON.stringify(submitForm));
          console.log('json', submitForm);

          const { success, data } = await addGoodsOutput(submitForm);
          if (success) {
            const res = await addGoodsOutputItem({
              table: value.table?.map((item: any) => ({
                ...item,
                order_id: data?.id,
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
      <DetailDrawer
        currentRow={currentRow}
        showDetail={showDetail}
        currentOutputId={currentRow?.id || 0}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
      <AddPayForm
        payModalOpen={payModalOpen}
        controlCreateModelVisible={(flag?: boolean) => {
          handlePayModalOpen(flag || false);
        }}
        onFinish={async (values) => {
          const addItem: {
            type: string;
            order_id: number | undefined;
            method: string;
            created_at: Date;
            amount: number;
            another_id: number | undefined;
            id?: number;
          } = {
            type: 'output_income',
            order_id: currentRow?.id,
            method: values.method,
            created_at: values.created_at,
            amount: values.pay,
            another_id: currentRow?.to_id,
          };
          const { success, data } = await addAccount(addItem);
          if (success) {
            addItem.id = data?.id;
            const jsonData = JSON.stringify(addItem);
            const pay_log_list = currentRow?.pay_log?.split('\n') || [];
            pay_log_list.push(jsonData);
            const is_pay_over =
              getSum(pay_log_list.join('\n')) === parseFloat('' + currentRow?.cost || '0');
            const res = await updateGoodsOutput({
              ...currentRow,
              pay_log: pay_log_list.join('\n'),
              status: is_pay_over ? true : false,
            });
            if (res.success) {
              handlePayModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
        values={{}}
      />
    </PageContainer>
  );
};

export default TableList;
