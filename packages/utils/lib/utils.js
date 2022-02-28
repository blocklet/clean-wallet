"use strict";

const ora = require('ora');

const util = require('util');

const chalk = require('chalk');

const progress = require('cli-progress');

const symbols = require('log-symbols');

const shell = require('shelljs');

function print() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  shell.echo.apply(null, args);
}

function printInfo() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  print.apply(null, [symbols.info, ...args]);
}

function printSuccess() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  print.apply(null, [symbols.success, ...args]);
}

function printWarning() {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  print.apply(null, [symbols.warning, ...args]);
}

function printError() {
  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  if (args.length && args[0] instanceof Error) {
    args[0] = args[0].message;
  }

  console.error.apply(null, [symbols.error, ...args]);
} // https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json


const spinners = ['dots', 'dots2', 'dots3', 'dots4', 'dots5', 'dots6', 'dots7', 'dots8', 'dots9', 'dots10', 'dots11', 'dots12', 'line', 'line2', 'pipe', 'simpleDots', 'simpleDotsScrolling', 'star', 'star2', 'flip', 'hamburger', 'growVertical', 'growHorizontal', 'balloon', 'balloon2', 'noise', 'bounce', 'boxBounce', 'boxBounce2', 'triangle', 'arc', 'circle', 'squareCorners', 'circleQuarters', 'circleHalves', 'squish', 'toggle', 'toggle2', 'toggle3', 'toggle4', 'toggle5', 'toggle6', 'toggle7', 'toggle8', 'toggle9', 'toggle10', 'toggle11', 'toggle12', 'toggle13', 'arrow', 'arrow2', 'arrow3', 'bouncingBar', 'bouncingBall', 'smiley', 'monkey', 'hearts', 'clock', 'earth', 'moon', 'runner', 'pong', 'shark', 'dqpb', 'weather', 'christmas', 'grenade', 'point', 'layer'];

const getSpinner = opts => {
  const random = Math.floor(Math.random() * spinners.length);
  const spinner = ora(Object.assign({
    spinner: spinners[random]
  }, opts || {}));

  if (typeof opts === 'string') {
    spinner.text = opts;
  }

  return spinner;
};

const wrapSpinner = async function wrapSpinner() {
  let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let func = arguments.length > 1 ? arguments[1] : undefined;
  let throwOnError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const spinner = getSpinner(message);
  const startTime = Date.now();
  spinner.start();

  try {
    const result = await func();
    spinner.succeed("".concat(message, " Done in ").concat(chalk.cyan((Date.now() - startTime) / 1000), "s"));
    return result;
  } catch (err) {
    spinner.fail("".concat(message, " Fail after ").concat(chalk.cyan((Date.now() - startTime) / 1000), "s"));

    if (throwOnError) {
      throw err;
    }

    return null;
  }
};

const api = {
  symbols,
  pretty: (data, options) => {
    if (data && typeof data === 'object') {
      return "\n".concat(JSON.stringify(data, null, 2), "\n");
    }

    return util.inspect(data, Object.assign({
      depth: 8,
      colors: true,
      compact: false
    }, options));
  },
  getProgress: _ref => {
    let {
      title,
      unit = 'MB'
    } = _ref;
    return new progress.Bar({
      format: "".concat(title, " |").concat(chalk.cyan('{bar}'), " {percentage}% || {value}/{total} ").concat(unit),
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
  },
  getSpinner,
  wrapSpinner,
  printInfo,
  printSuccess,
  printWarning,
  printError
};
module.exports = api;