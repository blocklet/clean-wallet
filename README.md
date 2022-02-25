# Clean Wallet Blocklet

This is a blocklet for cleaning up wallet backups, cleaning up apps and accounts that have failed.

## Visuals

![upload page](./screenshots/upload.png)
![password page](./screenshots/password.png)
![download page](./screenshots/download.png)

## Development

## Requirement

- A locally running

### Clone and install dependencies

```shell
git clone git@github.com:blocklet/clean-wallet.git
cd clean-wallet && yarn install
```

### Start debug

```shell
blocklet dev
```

### Deploy to local Blocklet Server

```shell
npm run bundle
blocklet deploy .blocklet/bundle
```

## License

[MIT](LICENSE)
