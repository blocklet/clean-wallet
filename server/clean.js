#!/usr/bin/env node

const fs = require('fs');
const prompts = require('prompts');

const { decryptBackup, encryptBackup } = require('./libs/encrypt');
const cleanFunc = require('./libs/clean/util');

const { printError, printSuccess, printInfo, wrapSpinner } = require('./utils');

async function init() {
  let result = {};

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'filePath',
          message: 'Please input the file path for the backup',
          validate: (value) => (!value.trim() ? 'Input cannot be empty.' : true),
        },
        {
          type: 'password',
          name: 'password',
          message: 'Please input password for the backup',
          validate: (value) => (!value.trim() ? 'Input cannot be empty.' : true),
        },
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Can you confirm?',
          initial: true,
        },
      ],
      {
        onCancel: () => {
          throw new Error('Operation cancelled');
        },
      }
    );
  } catch (cancelled) {
    printError(cancelled.message);
    return;
  }

  // user choice associated with prompts
  const { filePath: file1, password, confirm } = result;
  const filePath = file1.trim();

  if (!confirm) {
    printError('Cancel confirmation');
    process.exit(1);
  }

  if (!filePath) {
    printError('The file cannot be empty.');
    process.exit(1);
  }

  if (!password) {
    printError('Password cannot be empty.');
    process.exit(1);
  }

  try {
    fs.readFileSync(filePath);
  } catch (error) {
    printError('File does not exist.');
    process.exit(1);
  }

  const backupStr = fs.readFileSync(filePath, 'utf8');
  let backup = null;

  try {
    backup = decryptBackup(backupStr, password);
  } catch (error) {
    printError('Password is incorrect.');
    process.exit(1);
  }

  const abt = backup.replace(/\s/g, '');
  let files = [];
  try {
    files = JSON.parse(abt);
  } catch (error) {
    printError('Parsing file error');
    process.exit(1);
  }

  let info;
  try {
    await wrapSpinner('Start cleaning up files...', async () => {
      info = await cleanFunc(files);
    });
  } catch (error) {
    printError('Clean up file sending error');
    process.exit(1);
  }
  const app = files.appInfoList.length - info.appInfoList.length;
  const accounts = files.accounts.length - info.accounts.length;

  printInfo(
    `The apps is ${files.appInfoList.length} before it is cleaned and ${info.appInfoList.length} after it is cleaned, Clean up ${app} of apps information `
  );
  printInfo(
    `The accounts is ${files.accounts.length} before it is cleaned and ${info.accounts.length} after it is cleaned, Clean up ${accounts} of accounts information `
  );

  const splitPath = filePath.split('/');
  splitPath[splitPath.length - 1] = `clean_${splitPath[splitPath.length - 1]}`;
  const cleanFileName = splitPath.join('/');
  const encryptStr = encryptBackup(JSON.stringify(info), password);

  try {
    await wrapSpinner('Start writing file...', async () => {
      fs.writeFileSync(cleanFileName, encryptStr);
    });
  } catch (err) {
    console.log('Writing file failed.');
    process.exit(1);
  }

  printSuccess(`The cleaned file has been written to ${cleanFileName}`);
}

init().catch((e) => {
  printError(e);
});
