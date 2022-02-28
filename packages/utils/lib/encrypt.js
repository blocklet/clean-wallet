"use strict";

const CryptoJS = require('crypto-js');
/**
 * 默认程度为16位 超过16位的会被截取前16位 不够的使用 “ ”补全
 * @param {} vi
 */


function createIV() {
  let vi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (vi.length > 16) {
    return vi.substring(0, 16);
  }

  return vi.padEnd(16, ' ');
}
/**
 * 默认程度为32位 超过32位的会被截取前32位 不够的使用 “ ”补全
 * @param {} vi
 */


function createKey(key) {
  if (key.length > 32) {
    return key.substring(0, 32);
  }

  return key.padEnd(32, ' ');
} // 偏移量


const iv = CryptoJS.enc.Utf8.parse(createIV(''));
const option = {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}; // 加密内容

const encryptBackup = (data, pwd) => {
  let key = createKey(pwd);
  key = CryptoJS.enc.Utf8.parse(key);
  const cipher = CryptoJS.AES.encrypt(data.replace(/\s/g, ''), key, option);
  return cipher.toString();
}; // 解密内容


const decryptBackup = (data, pwd) => {
  let key = createKey(pwd);
  key = CryptoJS.enc.Utf8.parse(key);
  const cipher = CryptoJS.AES.decrypt(data.replace(/\s/g, ''), key, option);
  return cipher.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptBackup,
  decryptBackup
};