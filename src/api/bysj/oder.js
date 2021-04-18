import request from '@/utils/request'

// 查询订单信息列表
export function listOder(query) {
  return request({
    url: '/bysj/oder/list',
    method: 'get',
    params: query
  })
}

// 查询订单信息详细
export function getOder(userId) {
  return request({
    url: '/bysj/oder/' + userId,
    method: 'get'
  })
}

// 新增订单信息
export function addOder(data) {
  return request({
    url: '/bysj/oder',
    method: 'post',
    data: data
  })
}

// 修改订单信息
export function updateOder(data) {
  return request({
    url: '/bysj/oder',
    method: 'put',
    data: data
  })
}

// 删除订单信息
export function delOder(userId) {
  return request({
    url: '/bysj/oder/' + userId,
    method: 'delete'
  })
}

// 导出订单信息
export function exportOder(query) {
  return request({
    url: '/bysj/oder/export',
    method: 'get',
    params: query
  })
}