const ora = require('ora');
const util = require('util');
const chalk = require('chalk');
const progress = require('cli-progress');
const symbols = require('log-symbols');
const shell = require('shelljs');

function print(...args) {
  shell.echo.apply(null, args);
}

function printInfo(...args) {
  print.apply(null, [symbols.info, ...args]);
}

function printSuccess(...args) {
  print.apply(null, [symbols.success, ...args]);
}

function printWarning(...args) {
  print.apply(null, [symbols.warning, ...args]);
}

function printError(...args) {
  if (args.length && args[0] instanceof Error) {
    args[0] = args[0].message;
  }

  console.error.apply(null, [symbols.error, ...args]);
}
// https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json
const spinners = [
  'dots',
  'dots2',
  'dots3',
  'dots4',
  'dots5',
  'dots6',
  'dots7',
  'dots8',
  'dots9',
  'dots10',
  'dots11',
  'dots12',
  'line',
  'line2',
  'pipe',
  'simpleDots',
  'simpleDotsScrolling',
  'star',
  'star2',
  'flip',
  'hamburger',
  'growVertical',
  'growHorizontal',
  'balloon',
  'balloon2',
  'noise',
  'bounce',
  'boxBounce',
  'boxBounce2',
  'triangle',
  'arc',
  'circle',
  'squareCorners',
  'circleQuarters',
  'circleHalves',
  'squish',
  'toggle',
  'toggle2',
  'toggle3',
  'toggle4',
  'toggle5',
  'toggle6',
  'toggle7',
  'toggle8',
  'toggle9',
  'toggle10',
  'toggle11',
  'toggle12',
  'toggle13',
  'arrow',
  'arrow2',
  'arrow3',
  'bouncingBar',
  'bouncingBall',
  'smiley',
  'monkey',
  'hearts',
  'clock',
  'earth',
  'moon',
  'runner',
  'pong',
  'shark',
  'dqpb',
  'weather',
  'christmas',
  'grenade',
  'point',
  'layer',
];

const getSpinner = (opts) => {
  const random = Math.floor(Math.random() * spinners.length);
  const spinner = ora(Object.assign({ spinner: spinners[random] }, opts || {}));
  if (typeof opts === 'string') {
    spinner.text = opts;
  }

  return spinner;
};

const wrapSpinner = async (message = '', func, throwOnError = true) => {
  const spinner = getSpinner(message);
  const startTime = Date.now();
  spinner.start();
  try {
    const result = await func();
    spinner.succeed(`${message} Done in ${chalk.cyan((Date.now() - startTime) / 1000)}s`);
    return result;
  } catch (err) {
    spinner.fail(`${message} Fail after ${chalk.cyan((Date.now() - startTime) / 1000)}s`);
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
      return `\n${JSON.stringify(data, null, 2)}\n`;
    }

    return util.inspect(data, Object.assign({ depth: 8, colors: true, compact: false }, options));
  },
  getProgress: ({ title, unit = 'MB' }) =>
    new progress.Bar({
      format: `${title} |${chalk.cyan('{bar}')} {percentage}% || {value}/{total} ${unit}`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    }),
  getSpinner,
  wrapSpinner,
  printInfo,
  printSuccess,
  printWarning,
  printError,
};

module.exports = api;
