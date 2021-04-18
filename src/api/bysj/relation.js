import request from '@/utils/request'

// 查询家庭成员管理列表
export function listRelation(query) {
  return request({
    url: '/bysj/relation/list',
    method: 'get',
    params: query
  })
}

// 查询家庭成员管理详细
export function getRelation(userId,famalyId) {
  const data = {
    userId,famalyId
  }
  return request({
    url: '/bysj/relation/selectOne',
    method: 'post',
    data: data
  })
}

// 新增家庭成员管理
export function addRelation(data) {
  return request({
    url: '/bysj/relation',
    method: 'post',
    data: data
  })
}

// 修改家庭成员管理
export function updateRelation(data) {
  return request({
    url: '/bysj/relation',
    method: 'put',
    data: data
  })
}

// 删除家庭成员管理
export function delRelation(userId) {
  return request({
    url: '/bysj/relation/' + userId,
    method: 'delete'
  })
}

// 导出家庭成员管理
export function exportRelation(query) {
  return request({
    url: '/bysj/relation/export',
    method: 'get',
    params: query
  })
}
