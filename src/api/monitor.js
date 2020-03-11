import request from '@/utils/request'

// 上报监控
export function GetReported(data) {
  return request({
    url: '/Monitoring/Reported/GetReported',
    method: 'post',
    data
  })
}
export function OperationService(data) {
  return request({
    url: '/Monitoring/Reported/OperationService',
    method: 'post',
    data
  })
}
export function CommunicationService(data) {
  return request({
    url: '/Monitoring/Reported/CommunicationService',
    method: 'post',
    data
  })
}
export function GetDictTable(data) {
  return request({
    url: '/Monitoring/Reported/GetDictTable',
    method: 'post',
    data
  })
}

// 推送记录
export function GetPushRecordList(data) {
  return request({
    url: '/Monitoring/Push/GetPushRecordList',
    method: 'post',
    data
  })
}
export function GetPushRecord(data) {
  return request({
    url: '/Monitoring/Push/GetPushRecord',
    method: 'post',
    data
  })
}

// 调阅记录
export function GetReadRecordList(data) {
  return request({
    url: '/Monitoring/Read/GetReadRecordList',
    method: 'post',
    data
  })
}
export function GetReadRecord(data) {
  return request({
    url: '/Monitoring/Read/GetReadRecord',
    method: 'post',
    data
  })
}
