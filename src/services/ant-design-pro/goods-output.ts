// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

type addGoodsOutputType = {
  success?: boolean;
  data?: API.GoodsOutputListItem;
};

/** 获取规则列表 GET /api/goods/output */
export async function getGoodsOutput(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.GoodsOutputList>('/api/goods/output', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/goods/output */
export async function updateGoodsOutput(options?: { [key: string]: any }) {
  console.log('options', options);

  return request<addGoodsOutputType>(`/api/goods/output/${options?.id}`, {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/goods/output */
export async function addGoodsOutput(options?: { [key: string]: any }) {
  return request<addGoodsOutputType>('/api/goods/output', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/goods/output */
export async function removeGoodsOutput(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/goods/output/${options?.id}`, {
    method: 'DELETE',
    data: {
      ...(options || {}),
    },
  });
}
