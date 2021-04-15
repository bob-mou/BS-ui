import request from '@/utils/request'

// 查询收藏管理列表
export function listCollect(query) {
  return request({
    url: '/bysj/collect/list',
    method: 'get',
    params: query
  })
}

// 查询收藏管理详细
export function getCollect(patientId) {
  return request({
    url: '/bysj/collect/' + patientId,
    method: 'get'
  })
}

// 新增收藏管理
export function addCollect(data) {
  return request({
    url: '/bysj/collect',
    method: 'post',
    data: data
  })
}

// 修改收藏管理
export function updateCollect(data) {
  return request({
    url: '/bysj/collect',
    method: 'put',
    data: data
  })
}

// 删除收藏管理
export function delCollect(patientId) {
  return request({
    url: '/bysj/collect/' + patientId,
    method: 'delete'
  })
}

// 导出收藏管理
export function exportCollect(query) {
  return request({
    url: '/bysj/collect/export',
    method: 'get',
    params: query
  })
}