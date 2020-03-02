import request from '@/utils/request'

export function reportedGetLIst(data) {
  return request({
    url: '/Reported/Projects/GetList',
    method: 'post',
    data
  })
}

export function reportedGetModels(data) {
  return request({
    url: '/Reported/Projects/GetModels',
    method: 'post',
    data
  })
}

export function ProjectsAddModels(data) {
  return request({
    url: '/Reported/Projects/AddModels',
    method: 'post',
    data
  })
}
export function ProjectsModifyModels(data) {
  return request({
    url: '/Reported/Projects/ModifyModels',
    method: 'post',
    data
  })
}
export function ProjectsRemoveModels(data) {
  return request({
    url: '/Reported/Projects/RemoveModels',
    method: 'post',
    data
  })
}

export function GetProjects(data) {
  return request({
    url: '/api/Selects/GetProjects',
    method: 'post',
    data
  })
}

// 服务

export function GetServicesList(data) {
  return request({
    url: '/Reported/Services/GetList',
    method: 'post',
    data
  })
}
export function ServicesModifyProjects(data) {
  return request({
    url: '/Reported/Services/ModifyProjects',
    method: 'post',
    data
  })
}
export function ServicesMAddModels(data) {
  return request({
    url: '/Reported/Services/AddModels',
    method: 'post',
    data
  })
}

// 数据表
export function GetDataTableList(data) {
  return request({
    url: '/Reported/DataTables/GetList',
    method: 'post',
    data
  })
}

export function ModifyProjects(data) {
  return request({
    url: '/Reported/DataTables/ModifyProjects',
    method: 'post',
    data
  })
}

export function AddDataTable(data) {
  return request({
    url: '/Reported/DataTables/AddModels',
    method: 'post',
    data
  })
}
// 数据项
export function GetDataItemsList(data) {
  return request({
    url: '/Reported/DataItems/GetList',
    method: 'post',
    data
  })
}
export function AddDataItemsTables(data) {
  return request({
    url: '/Reported/DataItems/AddTables',
    method: 'post',
    data
  })
}

export function DataItemsAddModels(data) {
  return request({
    url: '/Reported/DataItems/AddModels',
    method: 'post',
    data
  })
}

export function ProduceSql(data) {
  return request({
    url: '/Reported/DataItems/ProduceSql',
    method: 'post',
    data
  })
}

export function AddTableList(data) {
  return request({
    url: '/Reported/DataItems/AddTableList',
    method: 'post',
    data
  })
}
// 批次管理
export function GetBatchList(data) {
  return request({
    url: '/Reported/Batch/GetList',
    method: 'post',
    data
  })
}
export function GetBatch(data) {
  return request({
    url: '/Reported/Batch/GetBatch',
    method: 'post',
    data
  })
}
export function AddBatchRule(data) {
  return request({
    url: '/Reported/Batch/AddBatchRule',
    method: 'post',
    data
  })
}
export function AddBatchModels(data) {
  return request({
    url: '/Reported/Batch/AddModels',
    method: 'post',
    data
  })
}

// 内容列表

export function ContentsGetList(data) {
  return request({
    url: '/Reported/Contents/GetList',
    method: 'post',
    data
  })
}
export function ContentsModifyProjects(data) {
  return request({
    url: '/Reported/Contents/ModifyProjects',
    method: 'post',
    data
  })
}
export function ContentsAddModels(data) {
  return request({
    url: '/Reported/Contents/AddModels',
    method: 'post',
    data
  })
}
export function ContentsModifyModels(data) {
  return request({
    url: '/Reported/Contents/ModifyModels',
    method: 'post',
    data
  })
}
export function ContentsRemoveModels(data) {
  return request({
    url: '/Reported/Contents/RemoveModels',
    method: 'post',
    data
  })
}

// 上报字典
export function ReportDictsGetList(data) {
  return request({
    url: '/Reported/ReportDicts/GetList',
    method: 'post',
    data
  })
}
export function ReportDictsAddModels(data) {
  return request({
    url: '/Reported/ReportDicts/AddModels',
    method: 'post',
    data
  })
}
export function ReportDictsModifyModels(data) {
  return request({
    url: '/Reported/ReportDicts/ModifyModels',
    method: 'post',
    data
  })
}

// 上报字典 成员
export function ReportDictMembersGetList(data) {
  return request({
    url: '/Reported/ReportDictMembers/GetList',
    method: 'post',
    data
  })
}
export function ReportDictMembersAddModels(data) {
  return request({
    url: '/Reported/ReportDictMembers/AddModels',
    method: 'post',
    data
  })
}
export function ReportDictMembersModifyModels(data) {
  return request({
    url: '/Reported/ReportDictMembers/ModifyModels',
    method: 'post',
    data
  })
}

