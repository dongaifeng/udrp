import request from '@/utils/request'

// 审核上传
export function UploadGetProjectList(data) {
  return request({
    url: '/DataAudit/Upload/GetProjectList',
    method: 'post',
    data
  })
}
export function UploadGetList(data) {
  return request({
    url: '/DataAudit/Upload/GetList',
    method: 'post',
    data
  })
}
export function UploadGetDictTable(data) {
  return request({
    url: '/DataAudit/Upload/GetDictTable',
    method: 'post',
    data
  })
}

// 审核结果
export function GetAuditResultList(data) {
  return request({
    url: '/DataAudit/Result/GetAuditResultList',
    method: 'post',
    data
  })
}
