/* eslint-disable consistent-return */
const fs = require('fs-extra');
const nacl = require('tweetnacl');
const { toUint8Array, toBuffer, fromBase58, toBase58 } = require('@ocap/util');

const { backup: cleanFunc, encrypt } = require('clean-utils');

const { decryptBackup, encryptBackup } = encrypt;

const { resolve } = require('../util');

let files = null;
let backupStr = '';
let their = {};
let my = {};
const nonce = nacl.randomBytes(nacl.box.nonceLength);

const uploadFormData = (req, res) => {
  try {
    const filename = resolve(req.file.path);
    const form = fs.readFileSync(filename, 'utf-8');

    backupStr = form;

    their = nacl.box.keyPair();
    my = nacl.box.keyPair();

    return res.jsonp({
      code: 0,
      data: {
        nonce: toBase58(nonce),
        publicKey: toBase58(my.publicKey),
        secretKey: toBase58(their.secretKey),
      },
    });
  } catch (error) {
    return res.jsonp({ code: -1, error: error?.message });
  }
};

const decryptFile = (req, res, next) => {
  const pwd = req?.query?.password;
  if (!pwd) {
    return res.jsonp({ code: -1, error: 'Please enter your password' });
  }

  const origin = toUint8Array(fromBase58(pwd));
  const info = nacl.box.open(origin, nonce, their.publicKey, my.secretKey);
  const password = toBuffer(info).toString();

  if (!info || !password) {
    return res.jsonp({ code: -1, error: 'Please upload the file again' });
  }

  if (!backupStr) {
    return res.jsonp({ code: -1, error: 'Please upload the backup first' });
  }

  try {
    const result = decryptBackup(backupStr, password);
    const abt = result.replace(/\s/g, '');
    try {
      files = JSON.parse(abt);
    } catch (error) {
      return res.jsonp({ code: -1, error: 'Failed to parse file' });
    }

    req.files = files;
    req.password = password;

    return next();
  } catch (error) {
    return res.jsonp({ code: -1, error: 'Incorrect password' });
  }
};

const cleanWallet = async (req, res) => {
  const backup = req?.files;
  const pwd = req?.password;

  try {
    const result = await cleanFunc(backup);
    const encryptStr = encryptBackup(JSON.stringify(result), pwd);

    return res.jsonp({
      code: 0,
      data: {
        apps: {
          before: backup.appInfoList.length,
          after: result.appInfoList.length,
        },
        accounts: {
          before: backup.accounts.length,
          after: result.accounts.length,
        },
        backup: encryptStr,
      },
    });
  } catch (error) {
    return res.jsonp({ code: -1, error: error?.message });
  }
};

module.exports = {
  uploadFormData,
  decryptFile,
  cleanWallet,
};
