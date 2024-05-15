import { getGoodsInputItem } from '@/services/ant-design-pro/goods-input-item';
import { ProList } from '@ant-design/pro-components';
import { Badge, Card, Drawer, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

export type DetailDrawerProps = {
  showDetail: boolean;
  currentInputId: number;
  currentRow: API.GoodsInputListItem | undefined;
  onClose: () => void;
};

export default (props: DetailDrawerProps) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (!props.currentInputId) return;
    getGoodsInputItem({ order_id: props.currentInputId }).then((res) => {
      console.log(res);
      setDataSource(res.data || []);
    });
  }, [props.currentInputId]);

  return (
    <Drawer
      width={600}
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
        来源：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>{props.currentRow?.from_name}</span>
        日期：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {props.currentRow?.created_at?.toString().split('T')[0]}
        </span>
        总价值：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>￥{props.currentRow?.cost}</span>
        <div style={{ marginTop: 20 }} />
        联系方式：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {props.currentRow?.from_phone}
        </span>
        联系地址：
        <span style={{ fontWeight: 'bolder', marginRight: 30 }}>
          {props.currentRow?.from_address}
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
                  <Badge.Ribbon
                    text={row.state ? '已烘干' : '未烘干'}
                    color={row.state ? 'volcano' : ''}
                  >
                    <Card style={{ paddingRight: 30 }} size="small">
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
                  </Badge.Ribbon>
                </Space>
              );
            },
          },
        }}
      />
    </Drawer>
  );
};
