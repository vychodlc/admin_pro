import { getGoodsFrom } from '@/services/ant-design-pro/goods-from';
import {
  ActionType,
  EditableFormInstance,
  EditableProTable,
  ModalForm,
  ProColumns,
  ProFormDatePicker,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { Statistic } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

type DataSourceType = {
  id: React.Key;
  diameter?: number;
  length?: number;
  unit?: number;
  amount?: number;
  price?: number;
  cost?: number;
};

export type FormValueType = {
  created_at?: string;
  from_id?: string;
  from_name?: string;
  from_phone?: string;
  from_address?: string;
  state?: boolean;
  table?: DataSourceType[];
};

const defaultValues: FormValueType = {
  created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
  from_id: '',
  from_name: '',
  from_phone: '',
  from_address: '',
  state: false,
  table: [],
};

export type CreateFormProps = {
  controlCreateModelVisible: (flag?: boolean, formVals?: FormValueType) => void;
  onFinish: (values: FormValueType) => Promise<void>;
  createModalOpen: boolean;
  values: Partial<API.RuleListItem>;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [goodsFromList, setGoodsFromList] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const editableFormRef = useRef<EditableFormInstance>();

  const calculateTotal = (rowIndex: number) => {
    const values = editableFormRef.current?.getFieldsValue();
    values.table = values.table.map((item: any, index: number) => {
      if (index === rowIndex) {
        return {
          ...item,
          total: (item.amount || 0) * (item.price || 0) * (item.unit || 0),
        };
      }
      return item;
    });
    editableFormRef.current?.setFieldsValue(values);
  };

  const EditableProTableValidator = async (_: any, value: DataSourceType[]) => {
    if (!value || value.length < 1) {
      throw new Error('请至少添加一个竹条');
    } else {
      value.forEach((valueItem: DataSourceType) => {
        if (!valueItem.length || !valueItem.diameter || !valueItem.unit || !valueItem.price) {
          throw new Error('请填写完整的竹条信息');
        }
      });
    }
  };

  const editTableColumns: ProColumns<DataSourceType>[] = [
    {
      title: '直径',
      key: 'diameter',
      dataIndex: 'diameter',
      valueType: 'select',
      width: '13%',
      initialValue: 5.5,
      fieldProps: {
        options: [
          { value: 4.5, label: '4.5' },
          { value: 5.0, label: '5.0' },
          { value: 5.5, label: '5.5' },
          { value: 6.0, label: '6.0' },
        ],
      },
    },
    {
      title: '长度',
      key: 'length',
      dataIndex: 'length',
      valueType: 'select',
      width: '13%',
      initialValue: 185,
      fieldProps: {
        options: [{ value: 185, label: '185' }],
      },
    },
    {
      title: '根数/每捆',
      key: 'unit',
      dataIndex: 'unit',
      valueType: 'select',
      width: '13%',
      initialValue: 300,
      fieldProps: (_, { rowIndex }) => {
        return {
          options: [
            { value: 300, label: '300' },
            { value: 400, label: '400' },
          ],
          onSelect: () => {
            calculateTotal(rowIndex);
          },
        };
      },
    },
    {
      title: '数量',
      key: 'amount',
      initialValue: 1,
      dataIndex: 'amount',
      valueType: 'digit',
      width: '13%',
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            calculateTotal(rowIndex);
          },
        };
      },
    },
    {
      title: '单价',
      key: 'price',
      dataIndex: 'price',
      valueType: 'digit',
      width: '13%',
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            calculateTotal(rowIndex);
          },
        };
      },
    },
    {
      title: '总价',
      key: 'total',
      dataIndex: 'total',
      valueType: 'money',
      readonly: true,
      width: '13%',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '22%',
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('table') as DataSourceType[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
        <a
          key="edit"
          onClick={() => {
            actionRef.current?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  useEffect(() => {
    getGoodsFrom({}).then((res) => {
      setGoodsFromList(res.data || []);
    });
  }, []);
  return (
    <>
      <ModalForm<{ table: DataSourceType[] }>
        title="添加进货订单信息"
        width="80vw"
        layout="horizontal"
        open={props.createModalOpen}
        formRef={formRef}
        onOpenChange={props.controlCreateModelVisible}
        onFinish={props.onFinish}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={defaultValues}
      >
        <div style={{ marginTop: '20px' }}></div>

        <ProFormDependency name={['table']}>
          {({ table }) => {
            const cost = table?.reduce((pre: number, item: DataSourceType) => {
              return (pre || 0) + (item.price || 0) * (item.amount || 0) * (item.unit || 0);
            }, 0);
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  paddingBlockEnd: 16,
                }}
              >
                <div style={{ flex: 2 }}>
                  <ProFormDatePicker
                    rules={[{ required: true, message: '请选择创建时间' }]}
                    width="md"
                    name="created_at"
                    label="创建时间"
                    placeholder="请选择创建时间"
                  />
                  <ProFormSelect
                    rules={[{ required: true, message: '请选择厂商姓名' }]}
                    width="md"
                    name="from_id"
                    label="厂商姓名"
                    placeholder="请选择厂商姓名"
                    options={goodsFromList.map((item) => ({ label: item.name, value: item.id }))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <ProFormSwitch
                    rules={[{ required: true, message: '请选择烘干状态' }]}
                    name="state"
                    label="已经烘干"
                  />
                </div>
                <div style={{ flex: 1 }}></div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div>
                    {
                      <Statistic
                        style={{
                          textAlign: 'center',
                          backgroundColor: '#52c41a',
                          padding: 16,
                          borderRadius: 8,
                        }}
                        title={<span style={{ color: '#fff' }}>总花费 (元)</span>}
                        value={cost === 0 ? 0 : cost?.toFixed(2)}
                        precision={2}
                        valueStyle={{ color: '#fff' }}
                      />
                    }
                  </div>
                </div>
              </div>
            );
          }}
        </ProFormDependency>
        <EditableProTable<DataSourceType>
          rowKey="id"
          scroll={{
            x: true,
          }}
          editableFormRef={editableFormRef}
          controlled
          actionRef={actionRef}
          formItemProps={{
            label: '题库编辑',
            rules: [
              {
                validator: EditableProTableValidator,
              },
            ],
          }}
          maxLength={10}
          name="table"
          columns={editTableColumns}
          recordCreatorProps={{
            record: (index) => {
              return { id: index + 1 };
            },
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (_, __, defaultDom) => {
              return [defaultDom.delete];
            },
          }}
        />
      </ModalForm>
    </>
  );
};

export default CreateForm;
