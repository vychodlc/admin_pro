// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取规则列表 GET /api/goods/output/item */
export async function getGoodsOutputItem(
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
  return request<API.GoodsOutputItemList>('/api/goods/output/item', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/goods/output/item */
export async function updateGoodsOutputItem(options?: { [key: string]: any }) {
  return request<API.GoodsOutputItemList>(`/api/goods/output/item/${options?.id}`, {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/goods/output/item */
export async function addGoodsOutputItem(options?: { [key: string]: any }) {
  return request<API.GoodsOutputItemList>('/api/goods/output/item', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/goods/output/item */
export async function removeGoodsOutputItem(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/goods/output/item/${options?.id}`, {
    method: 'DELETE',
    data: {
      ...(options || {}),
    },
  });
}
