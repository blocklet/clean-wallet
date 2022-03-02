# Clean Wallet Util

A utility function to clean up the wallet

## Usage

For example:

```js
const { encrypt, utils } = require('clean-utils');

const { decryptBackup } = encrypt;
const { printError } = utils;

decryptBackup('1', '1233');
printError('error');
```
