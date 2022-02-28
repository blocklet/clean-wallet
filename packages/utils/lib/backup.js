"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  toDid
} = require('@ocap/util');

const axios = require('axios');

const pick = require('lodash/pick');

const authFn = async app => {
  const link = app === null || app === void 0 ? void 0 : app.link;

  try {
    const res = await axios({
      url: link,
      timeout: 10000
    });

    if (res.status === 200) {
      return app;
    }

    return _objectSpread({
      error: res.statusText
    }, app);
  } catch (error) {
    return _objectSpread({
      error
    }, app);
  }
};

const formatDateToIOS = date => {
  try {
    return date ? new Date(date).toISOString() : '';
  } catch (error) {
    return date;
  }
};

const backupV1 = async file => {
  const {
    base64Seed,
    profiles = [],
    walletEntities = [],
    myDapps = [],
    vcs = [],
    contacts = []
  } = file;
  let appInfoList = [];
  let chainInfoList = [];
  let formatContacts = [];
  let filterAccounts = [];

  if (walletEntities && walletEntities.length) {
    const apps = walletEntities.map(account => {
      const {
        appDid,
        name,
        description,
        icon,
        link,
        isInMyApps = false,
        banner = ''
      } = account;
      const updateTime = account.lastUsed || account.updateTime || '';
      const appId = appDid ? toDid(appDid) : '';
      const inApp = myDapps.find(x => toDid(x.appId) === appId);
      const collectedAt = formatDateToIOS(updateTime) || new Date().toISOString();
      const updateAt = formatDateToIOS(updateTime) || '';
      return {
        id: appId,
        name,
        link,
        banner,
        icon,
        description,
        isCollected: inApp ? true : isInMyApps,
        collectedAt,
        updateAt
      };
    });
    const appLinks = apps.filter(x => x.link);
    const appPromise = appLinks.map(x => authFn(x));
    const appResult = await Promise.all(appPromise);
    appInfoList = appResult.filter(x => !x.error);
  }

  if (walletEntities && walletEntities.length) {
    const chains = walletEntities.map(account => {
      const {
        chainHost = '',
        chainId = '',
        chainToken = '',
        decimals = 0,
        consensusVersion
      } = account;
      return {
        id: chainId,
        host: chainHost,
        symbol: chainId === 'eth' ? 'ETH' : chainToken,
        decimals,
        consensusVersion,
        icon: ''
      };
    });
    chainInfoList = chains;
  }

  if (contacts && contacts.length) {
    formatContacts = contacts.map(contact => {
      const result = pick(contact, ['contactAddress', 'name', 'note', 'updateAt', 'walletAppId', 'walletAppName', 'walletChainId']);
      const toAppId = result.walletAppId ? toDid(result.walletAppId) : '';
      return _objectSpread(_objectSpread({}, result), {}, {
        walletAppId: toAppId
      });
    });
  }

  if (walletEntities && walletEntities.length) {
    const accounts = walletEntities.map(x => {
      const appId = x.appDid ? toDid(x.appDid) : '';
      return {
        address: x.address,
        alias: '',
        appId,
        balance: x.balance,
        chainId: x.chainId,
        pathIndex: x.pathIndex || 0,
        tokenId: 'none',
        tokenAddress: 'none',
        subEndpoint: '',
        CNYPrice: '',
        USDPrice: '',
        networkId: 1
      };
    });
    filterAccounts = accounts.filter(x => {
      return appInfoList.find(y => y.id === x.appId);
    });
  }

  return {
    accounts: filterAccounts,
    appInfoList,
    chainInfoList,
    tokenInfoList: [],
    contacts: formatContacts,
    profiles,
    vcs,
    base64Seed,
    version: '3.0'
  };
};

const backupV3 = async file => {
  const {
    appInfoList,
    accounts
  } = file;
  const appLinks = appInfoList.filter(x => x.link);
  const appPromise = appLinks.map(x => authFn(x));
  const appResult = await Promise.all(appPromise);
  const connectApp = appResult.filter(x => !x.error);
  const filterAccounts = accounts.filter(x => {
    return connectApp.find(y => y.id === x.appId);
  });
  return _objectSpread(_objectSpread({}, file), {}, {
    appInfoList: connectApp,
    accounts: filterAccounts
  });
};

const func = async file => {
  if (!(file !== null && file !== void 0 && file.version)) {
    if (!(file !== null && file !== void 0 && file.base64Seed)) {
      throw new Error('Can not find the seed from backup file');
    }

    const list = await backupV1(file);
    return list;
  }

  if ((file === null || file === void 0 ? void 0 : file.version) === '3.0' || (file === null || file === void 0 ? void 0 : file.version) === '4.0') {
    if (!(file !== null && file !== void 0 && file.base64Seed)) {
      throw new Error('Can not find the seed from backup file');
    }

    const list = await backupV3(file);
    return list;
  } // 其他不认识的 version，直接报错


  throw new Error('version not match');
};

module.exports = func;