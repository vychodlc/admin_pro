// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取规则列表 GET /api/goods/input/item */
export async function getGoodsInputItem(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    order_id?: number | string;
  },
  options?: { [key: string]: any },
) {
  return request<API.GoodsInputItemList>('/api/goods/input/item', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/goods/input/item */
export async function updateGoodsInputItem(options?: { [key: string]: any }) {
  return request<API.GoodsInputItemList>(`/api/goods/input/item/${options?.id}`, {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/goods/input/item */
export async function addGoodsInputItem(options?: { [key: string]: any }) {
  return request<API.GoodsInputItemList>('/api/goods/input/item', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/goods/input/item */
export async function removeGoodsInputItem(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/goods/input/item/${options?.id}`, {
    method: 'DELETE',
    data: {
      ...(options || {}),
    },
  });
}
