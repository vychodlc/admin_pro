import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { useRef } from 'react';

type DataSourceType = {
  id: number;
  name: string;
  price: number;
  number: number;
  total: number;
};

type AddPayFormProps = {
  controlCreateModelVisible: (flag?: boolean, formVals?: any) => void;
  onFinish: (values: any) => Promise<void>;
  payModalOpen: boolean;
  values: Partial<API.RuleListItem>;
};

export default (props: AddPayFormProps) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <>
      <ModalForm<{ table: DataSourceType[] }>
        title="添加付款信息"
        width="30vw"
        layout="horizontal"
        open={props.payModalOpen}
        formRef={formRef}
        onOpenChange={props.controlCreateModelVisible}
        onFinish={props.onFinish}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        // initialValues={defaultValues}
      >
        <div style={{ marginTop: '20px' }}></div>
        <ProFormRadio.Group
          rules={[{ required: true, message: '请选择支付方式' }]}
          label="支付方式"
          name="method"
          initialValue="wechat"
          options={[
            {
              value: 'wechat',
              label: '微信支付',
            },
            {
              value: 'alipay',
              label: '支付宝支付',
            },
            {
              value: 'cash',
              label: '现金支付',
            },
          ]}
        />
        <ProFormDatePicker
          rules={[{ required: true, message: '请选择支付时间' }]}
          name="created_at"
          label="支付时间"
          placeholder="请选择支付时间"
        />
        <ProFormText
          rules={[{ required: true, message: '请输入支付金额' }]}
          name="pay"
          label="支付金额"
          placeholder="请输入支付金额"
        />
      </ModalForm>
    </>
  );
};
