const fs = require('fs-extra');
const path = require('path');

const { decryptBackup } = require('../encrypt');
const thinFunc = require('./util');

const resolve = (dir) => {
  return path.join(__dirname, '../../../', dir);
};

let files = null;

const formData = (req, res, next) => {
  try {
    const filename = resolve(req.file.path);
    const form = fs.readFileSync(filename, 'utf-8');

    req.abt = form;
    req.password = 'LPmagic@00';

    return next();
  } catch (error) {
    return res.jsonp({ error });
  }
};

const decryptFile = (req, res, next) => {
  if (!req.password) {
    return res.jsonp({ error: 'miss password' });
  }

  if (!req.abt) {
    return res.jsonp({ error: 'miss file' });
  }

  try {
    const result = decryptBackup(req.abt, req.password);
    const abt = result.replace(/\s/g, '');
    try {
      files = JSON.parse(abt);
    } catch (error) {
      return res.jsonp({ error });
    }

    req.files = files;

    return next();
  } catch (error) {
    return res.jsonp({ error: 'password is error' });
  }
};

const thinWallet = async (req, res) => {
  const backup = req?.files;

  try {
    const result = await thinFunc(backup);

    return res.jsonp({ result });
  } catch (error) {
    return res.jsonp({ error });
  }
};

module.exports = {
  formData,
  decryptFile,
  thinWallet,
};
