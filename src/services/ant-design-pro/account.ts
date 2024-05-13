// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

type AccountItem = {
  id: number;
  type?: string;
  order_id?: number;
  method?: string;
  created_at?: Date;
  amount?: number;
  another_id?: number;
};

type addAccountType = {
  success?: boolean;
  data?: AccountItem;
};

type Account = {
  data?: AccountItem[];
  total?: number;
  success?: boolean;
};

/** 获取规则列表 GET /api/account */
export async function getAccount(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<Account>('/api/account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/account */
export async function updateAccount(options?: { [key: string]: any }) {
  return request<addAccountType>(`/api/account/${options?.id}`, {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/account */
export async function addAccount(options?: { [key: string]: any }) {
  return request<addAccountType>('/api/account', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/account */
export async function removeAccount(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/account/${options?.id}`, {
    method: 'DELETE',
    data: {
      ...(options || {}),
    },
  });
}
