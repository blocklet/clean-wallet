/* eslint-disable no-console */
const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');

const path = require('path');

const resolve = (dir) => {
  return path.join(__dirname, '../../', dir);
};

const { formData, decryptFile, thinWallet } = require('../libs/thin');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}_${Date.now()}`);
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), formData, decryptFile, thinWallet, async (req, res) => {
  return res.jsonp({ purchaseFactoryAddresses: '' });
});

router.get('/upload', decryptFile, thinWallet, async (req, res) => {
  console.log(req);

  res.json({ purchaseFactoryAddresses: '' });
});

(() => {
  if (!fs.ensureDirSync(resolve('uploads/'))) {
    fs.ensureDirSync(resolve('uploads/'));
  }
})();

module.exports = router;
