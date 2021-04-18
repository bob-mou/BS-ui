import request from '@/utils/request'

// 查询放号管理列表
export function listTicket(query) {
  return request({
    url: '/bysj/ticket/list',
    method: 'get',
    params: query
  })
}

// 查询放号管理详细
export function getTicket(doctorId) {
  return request({
    url: '/bysj/ticket/' + doctorId,
    method: 'get'
  })
}

// 新增放号管理
export function addTicket(data) {
  return request({
    url: '/bysj/ticket',
    method: 'post',
    data: data
  })
}

// 修改放号管理
export function updateTicket(data) {
  return request({
    url: '/bysj/ticket',
    method: 'put',
    data: data
  })
}

// 删除放号管理
export function delTicket(doctorId) {
  return request({
    url: '/bysj/ticket/' + doctorId,
    method: 'delete'
  })
}

// 导出放号管理
export function exportTicket(query) {
  return request({
    url: '/bysj/ticket/export',
    method: 'get',
    params: query
  })
}