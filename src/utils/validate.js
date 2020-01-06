/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 * @description 表单验证密码
 */
export const validatePassword = () => (rule, value, callback) => {
  if (value.length < 3) {
    callback(new Error('密码长度必须大于等于3位'))
  } else {
    callback()
  }
}
/**
 * @param {string} firstPwd
 * @description 表单验证第二次密码输入
*/
export const validateRpNewPwd = (firstPwd) => (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== firstPwd) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
