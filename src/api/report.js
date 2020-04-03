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

// 服务列表

export function GetServicesList(data) {
  return request({
    url: '/Reported/Services/GetList',
    method: 'post',
    data
  })
}

export function GetServicesGetProjects(data) {
  return request({
    url: '/Reported/Services/GetServiceConfig',
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
export function ServicesAddModels(data) {
  return request({
    url: '/Reported/Services/AddModels',
    method: 'post',
    data
  })
}
export function ServicesModifyModels(data) {
  return request({
    url: '/Reported/Services/ModifyModels',
    method: 'post',
    data
  })
}
export function ServicesRemoveModels(data) {
  return request({
    url: '/Reported/Services/RemoveModels',
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
export function GetSourcesConfig(data) {
  return request({
    url: '/Reported/DataTables/GetSourcesConfig',
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
export function DataTablesModifyModels(data) {
  return request({
    url: '/Reported/DataTables/ModifyModels',
    method: 'post',
    data
  })
}
export function DataTablesRemoveModels(data) {
  return request({
    url: '/Reported/DataTables/RemoveModels',
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

export function GetTableConfig(data) {
  return request({
    url: '/Reported/DataItems/GetTableConfig',
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
export function DataItemsModifyModels(data) {
  return request({
    url: '/Reported/DataItems/ModifyModels',
    method: 'post',
    data
  })
}

export function DataItemsRemoveModels(data) {
  return request({
    url: '/Reported/DataItems/RemoveModels',
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
export function GetBatchRule(data) {
  return request({
    url: '/Reported/Batch/GetRule',
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
export function BatchModifyModels(data) {
  return request({
    url: '/Reported/Batch/ModifyModels',
    method: 'post',
    data
  })
}
export function BatchRemoveModels(data) {
  return request({
    url: '/Reported/Batch/RemoveModels',
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
export function GetContentsConfig(data) {
  return request({
    url: '/Reported/Contents/GetContentsConfig',
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
export function ReportDictsRemoveModels(data) {
  return request({
    url: '/Reported/ReportDicts/RemoveModels',
    method: 'post',
    data
  })
}

// 成员维护
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
export function ReportDictMembersRemoveModels(data) {
  return request({
    url: '/Reported/ReportDictMembers/RemoveModels',
    method: 'post',
    data
  })
}

