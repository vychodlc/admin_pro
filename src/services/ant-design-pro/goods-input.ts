// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

type addGoodsInputType = {
  success?: boolean;
  data?: API.GoodsInputListItem;
};

/** 获取规则列表 GET /api/goods/input */
export async function getGoodsInput(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.GoodsInputList>('/api/goods/input', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/goods/input */
export async function updateGoodsInput(options?: { [key: string]: any }) {
  console.log('options', options);

  return request<addGoodsInputType>(`/api/goods/input/${options?.id}`, {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/goods/input */
export async function addGoodsInput(options?: { [key: string]: any }) {
  return request<addGoodsInputType>('/api/goods/input', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/goods/input */
export async function removeGoodsInput(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/goods/input/${options?.id}`, {
    method: 'DELETE',
    data: {
      ...(options || {}),
    },
  });
}
