const axios = require('axios');

const authFn = async (app) => {
  const link = app?.link;

  try {
    const res = await axios({
      url: link,
      timeout: 5000,
    });

    if (res.status === 200) {
      return app;
    }

    return {
      error: res.statusText,
      ...app,
    };
  } catch (error) {
    return {
      error,
      ...app,
    };
  }
};

const func = async (file) => {
  const { appInfoList, accounts } = file;
  const appLinks = appInfoList.filter((x) => x.link);
  const appPromise = appLinks.map((x) => authFn(x));

  const appResult = await Promise.all(appPromise);
  const connectApp = appResult.filter((x) => !x.error);

  const filterAccounts = accounts.filter((x) => {
    return connectApp.find((y) => y.id === x.appId);
  });

  return {
    ...file,
    appInfoList: connectApp,
    accounts: filterAccounts,
  };
};

module.exports = func;
