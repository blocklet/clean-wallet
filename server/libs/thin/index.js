/* eslint-disable consistent-return */
const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const contentDisposition = require('content-disposition');
const destroy = require('destroy');
const onFinished = require('on-finished');

const { decryptBackup, encryptBackup } = require('../encrypt');
const thinFunc = require('./util');

const resolve = (dir) => {
  return path.join(__dirname, '../../../', dir);
};

let files = null;
let backupStr = '';

const uploadFormData = (req, res) => {
  try {
    const filename = resolve(req.file.path);
    const form = fs.readFileSync(filename, 'utf-8');

    backupStr = form;

    return res.jsonp({
      code: 0,
      data: backupStr,
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

  if (!backupStr) {
    return res.jsonp({ code: -1, error: 'Please upload the backup first' });
  }

  try {
    const result = decryptBackup(backupStr, pwd);
    const abt = result.replace(/\s/g, '');
    try {
      files = JSON.parse(abt);
    } catch (error) {
      console.log(error);
      return res.jsonp({ code: -1, error: 'Failed to parse file' });
    }

    req.files = files;

    return next();
  } catch (error) {
    return res.jsonp({ code: -1, error: 'Incorrect password' });
  }
};

const thinWallet = async (req, res) => {
  const backup = req?.files;
  const pwd = req?.query?.password;

  try {
    const result = await thinFunc(backup);
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
    // const now = new Date();
    // const date = dayjs(now).format('YYYY-MM-DD_HH-mm-ss');
    // const filename = `abt_backup_${date}.abt`;
    // const absPath = resolve(filename);

    // fs.writeFile(absPath, encryptStr, (err) => {
    //   if (err) {
    //     return res.jsonp({ code: -1, error: err?.message });
    //   }

    //   res.setHeader('Content-Disposition', contentDisposition(absPath));

    //   // send file
    //   const stream = fs.createReadStream(absPath);
    //   stream.pipe(res);
    //   onFinished(res, () => {
    //     destroy(stream);
    //   });
    // });
  } catch (error) {
    return res.jsonp({ code: -1, error: error?.message });
  }
};

module.exports = {
  uploadFormData,
  decryptFile,
  thinWallet,
};
