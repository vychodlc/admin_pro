import { getGoodsOutputItem } from '@/services/ant-design-pro/goods-output-item';
import { ProList } from '@ant-design/pro-components';
import { Card, Drawer, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

export type DetailDrawerProps = {
  showDetail: boolean;
  currentOutputId: number;
  currentRow: API.GoodsOutputListItem | undefined;
  onClose: () => void;
};

export default (props: DetailDrawerProps) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (!props.currentOutputId) return;
    getGoodsOutputItem({ order_id: props.currentOutputId }).then((res) => {
      console.log('123123', res);
      setDataSource(res.data || []);
    });
  }, [props.currentOutputId]);

  return (
    <Drawer
      width={'35vw'}
      open={props.showDetail}
      onClose={props.onClose}
      closable={false}
      destroyOnClose
      title="订单详情"
    >
      <div
        style={{
          width: '100%',
        }}
      >
        买家：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>{props.currentRow?.to_name}</span>
        日期：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {props.currentRow?.created_at?.toString().split('T')[0]}
        </span>
        <div style={{ marginTop: 20 }} />
        总价值：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>￥{props.currentRow?.cost}</span>
        总件数：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {dataSource.reduce((pre, item) => {
            return pre + parseInt(item.amount);
          }, 0)}{' '}
          件
        </span>
        <div style={{ marginTop: 20 }} />
        联系方式：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>{props.currentRow?.to_phone}</span>
        联系地址：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {props.currentRow?.to_address}
        </span>
        <div style={{ marginTop: 20 }} />
        驾驶员信息（姓名，电话，车牌号）：
        <div style={{ marginTop: 5 }} />
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {props.currentRow?.driver?.split(',')[0]}
        </span>
      </div>
      <ProList
        rowKey="id"
        dataSource={dataSource}
        showActions="hover"
        editable={{
          onSave: async (key, record, originRow) => {
            console.log(key, record, originRow);
            return true;
          },
        }}
        onDataSourceChange={setDataSource}
        metas={{
          description: {
            dataIndex: 'desc',
            render: (_, row) => {
              return (
                <Space size={0}>
                  <Card style={{ padding: 0 }} size="small">
                    <h2>{row.total} 元</h2>
                    <div style={{ marginTop: 10 }} />
                    直径：
                    <Tag color="blue" key="">
                      {row?.diameter || ''}{' '}
                    </Tag>
                    长度：
                    <Tag color="blue" key="">
                      {row?.length || ''}
                    </Tag>
                    <div style={{ marginTop: 10 }} />
                    每捆根数：
                    <Tag color="blue" key="">
                      {row?.unit || ''} 支
                    </Tag>
                    件数：
                    <Tag color="blue" key="">
                      {' '}
                      {row?.amount || ''} 件
                    </Tag>
                    单价：
                    <Tag color="blue" key="">
                      {row?.price || ''} 元
                    </Tag>
                  </Card>
                </Space>
              );
            },
          },
        }}
      />
    </Drawer>
  );
};
