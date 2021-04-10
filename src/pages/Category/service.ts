import { request } from 'umi';

export async function query(
  params: Global.PageParams,
  options?: { [key: string]: any },
) {
  return request<Category.Item>('/api/category', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function create(data: Category.Item) {
  return request<Category.Item>('/api/category', {
    method: 'POST',
    data
  });
}

export async function update(id: string, data: Category.Item) {
  return request<Category.Item>(`/api/category/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function remove(ids: string[]) {
  return request<Record<string, any>>('/api/category', {
    method: 'DELETE',
    data: {
      ids
    },
  });
}
