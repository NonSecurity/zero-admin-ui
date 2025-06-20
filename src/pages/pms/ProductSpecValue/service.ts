import {request} from 'umi';
import type { ProductSpecValueListParams, ProductSpecValueListItem } from './data.d';

// 添加商品规格值
export async function addProductSpecValue(params: ProductSpecValueListItem) {
  return request('/api/pms/productSpecValue/addSpecValue', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除商品规格值
export async function removeProductSpecValue(ids: number[]) {
  return request('/api/pms/productSpecValue/deleteSpecValue?ids=' + ids.join(','), {
    method: 'GET',
  });
}


// 更新商品规格值
export async function updateProductSpecValue(params: ProductSpecValueListItem) {
  return request('/api/pms/productSpecValue/updateSpecValue', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 批量更新商品规格值状态
export async function updateProductSpecValueStatus(params: { ids: number[], status: number }) {
  return request('/api/pms/productSpecValue/updateSpecValueStatus', {
    method: 'POST',
    data: {
      ...params,
    },

  });
}


// 查询商品规格值详情
export async function queryProductSpecValueDetail(id: number) {
  return request('/api/pms/productSpecValue/querySpecValueDetail?id=' + id, {
    method: 'GET',
  });
}

// 分页查询商品规格值列表
export async function queryProductSpecValueList(params: ProductSpecValueListParams) {

  return request('/api/pms/productSpecValue/querySpecValueList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
