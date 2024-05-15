import { addGoodsFrom, getGoodsFrom, updateGoodsFrom } from '@/services/ant-design-pro/goods-from';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';

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
 * @param id
 * @param fields
 */
const handleUpdate = async (id: number, fields: Partial<API.GoodsFromListItem>) => {
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

const TableList = (props: { tableType: 'goodsFrom' | 'goodsTo' }) => {
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

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodsFromListItem>();
  const [current, setCurrent] = useState<number>(1);

  const columns: ProColumns<API.GoodsFromListItem>[] = [
    {
      title: '厂商姓名',
      dataIndex: 'name',
      valueType: 'textarea',
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
            setCurrentRow(record);
            handleUpdateModalOpen(true);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="deletePop"
          title="删除厂商"
          description="你真的确定要删除这个厂商吗？"
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
    <>
      <ProTable<API.GoodsFromListItem, API.PageParams>
        toolbar={{
          title: <h2>{props.tableType === 'goodsFrom' ? '进货' : '卖货'}厂商管理</h2>,
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
          layout: 'vertical',
          labelWidth: 'auto',
          searchGutter: 10,
          span: 4,
        }}
        form={{
          size: 'small',
          style: {
            paddingTop: 10,
            paddingBottom: 0,
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
            <PlusOutlined /> 添加厂商信息
          </Button>,
        ]}
        request={async (params) => {
          const res = await getGoodsFrom({
            ...params,
            current,
            pageSize: 10,
            type: props.tableType === 'goodsFrom' ? 'come' : 'go',
          });
          return res;
        }}
        columns={columns}
        defaultSize="small"
      />
      <ModalForm
        title="添加厂商信息"
        width="400px"
        layout="horizontal"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          value.type = props.tableType === 'goodsFrom' ? 'come' : 'go';
          const success = await handleAdd(value as API.GoodsFromListItem);
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
          const success = await handleUpdate(currentRow?.id || 1, value as API.GoodsFromListItem);
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
    </>
  );
};

const TwoTable: React.FC = () => {
  return (
    <PageContainer
      pageHeaderRender={false}
      token={{
        paddingBlockPageContainerContent: 10,
      }}
    >
      <ProCard split="vertical" gutter={30} bodyStyle={{ padding: 0 }} headStyle={{ padding: 0 }}>
        <ProCard bodyStyle={{ padding: 0 }} size="small">
          <TableList tableType="goodsFrom" />
        </ProCard>
        <ProCard bodyStyle={{ padding: 0 }} size="small">
          <TableList tableType="goodsTo" />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default TwoTable;
