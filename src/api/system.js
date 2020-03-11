import request from '@/utils/request'
import { downloadFile } from '@/utils'

// 系统配置
export function ConfigGetConfig(data) {
  return request({
    url: '/System/Config/GetConfig',
    method: 'post',
    data
  })
}
export function ConfigUplConfig(data) {
  return request({
    url: '/System/Config/UplConfig',
    method: 'post',
    data
  })
}
// 数据源
export function DataSourcesGetList(data) {
  return request({
    url: '/System/DataSources/GetList',
    method: 'post',
    data
  })
}
export function DataSourcesAddModels(data) {
  return request({
    url: '/System/DataSources/AddModels',
    method: 'post',
    data
  })
}
export function DataSourcesModifyModels(data) {
  return request({
    url: '/System/DataSources/ModifyModels',
    method: 'post',
    data
  })
}
export function DataSourcesRemoveModels(data) {
  return request({
    url: '/System/DataSources/RemoveModels',
    method: 'post',
    data
  })
}
export function TestDataSources(data) {
  return request({
    url: '/System/DataSources/TestDataSources',
    method: 'post',
    data
  })
}

// 系统字典
export function systemDictGetLIst(data) {
  return request({
    url: '/System/Dict/GetList',
    method: 'post',
    data
  })
}

export function systemDictGetMemberList(data) {
  return request({
    url: '/System/Dict/GetMemberList',
    method: 'post',
    data
  })
}
export function systemDictModifyModels(data) {
  return request({
    url: '/System/Dict/ModifyModels',
    method: 'post',
    data
  })
}
export function systemDictAddModels(data) {
  return request({
    url: '/System/Dict/AddModels',
    method: 'post',
    data
  })
}
export function systemDictRemoveModels(data) {
  return request({
    url: '/System/Dict/RemoveModels',
    method: 'post',
    data
  })
}

// ESB服务器
export function ESBServersGetList(data) {
  return request({
    url: '/System/ESBServers/GetList',
    method: 'post',
    data
  })
}
export function ESBServersAddModels(data) {
  return request({
    url: '/System/ESBServers/AddModels',
    method: 'post',
    data
  })
}
export function ESBServersModifyModels(data) {
  return request({
    url: '/System/ESBServers/ModifyModels',
    method: 'post',
    data
  })
}
export function ESBServersRemoveModels(data) {
  return request({
    url: '/System/ESBServers/RemoveModels',
    method: 'post',
    data
  })
}
export function TestESBServers(data) {
  return request({
    url: '/System/ESBServers/TestESBServers',
    method: 'post',
    data
  })
}

// 院内字典
export function HospitalDictsGetList(data) {
  return request({
    url: '/System/HospitalDicts/GetList',
    method: 'post',
    data
  })
}
export function HospitalDictsAddModels(data) {
  return request({
    url: '/System/HospitalDicts/AddModels',
    method: 'post',
    data
  })
}
export function HospitalDictsModifyModels(data) {
  return request({
    url: '/System/HospitalDicts/ModifyModels',
    method: 'post',
    data
  })
}
export function HospitalDictsRemoveModels(data) {
  return request({
    url: '/System/HospitalDicts/RemoveModels',
    method: 'post',
    data
  })
}

// 院内字典 成员
export function HospitalDictsMembersGetList(data) {
  return request({
    url: '/System/HospitalDictMembers/GetList',
    method: 'post',
    data
  })
}
export function HospitalDictsMembersAddModels(data) {
  return request({
    url: '/System/HospitalDictMembers/AddModels',
    method: 'post',
    data
  })
}
export function HospitalDictsMembersModifyModels(data) {
  return request({
    url: '/System/HospitalDictMembers/ModifyModels',
    method: 'post',
    data
  })
}
export function HospitalDictsMembersRemoveModels(data) {
  return request({
    url: '/System/HospitalDictMembers/RemoveModels',
    method: 'post',
    data
  })
}
export function DownloadTemplate(data) {
  return downloadFile('/api/Files/DownloadTemplate')
}
