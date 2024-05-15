// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

type GoodsFromListItem = {
  id: number;
  name?: string;
  address?: string;
  phone?: string;
};

type GoodsFromList = {
  data?: GoodsFromListItem[];
  total?: number;
  success?: boolean;
};

/** 获取规则列表 GET /api/goods/from */
export async function getGoodsFrom(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    type?: string;
  },
  options?: { [key: string]: any },
) {
  return request<GoodsFromList>('/api/goods/from', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/goods/from */
export async function updateGoodsFrom(options?: { [key: string]: any }) {
  return request<GoodsFromListItem>(`/api/goods/from/${options?.id}`, {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/goods/from */
export async function addGoodsFrom(options?: { [key: string]: any }) {
  return request<GoodsFromListItem>('/api/goods/from', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/goods/from */
export async function removeGoodsFrom(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/goods/from/${options?.id}`, {
    method: 'DELETE',
    data: {
      ...(options || {}),
    },
  });
}
