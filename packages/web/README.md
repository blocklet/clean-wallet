# Clean Wallet Blocklet

This is a blocklet for cleaning up wallet backups, cleaning up apps and accounts that have failed.

## Launch on Blocklet Server

[![Launch on Blocklet Server](https://assets.arcblock.io/icons/launch_on_blocklet_server.svg)](https://install.arcblock.io/?action=blocklet-install&meta_url=https%3A%2F%2Fgithub.com%2Fblocklet%2Fclean-wallet%2Freleases%2Fdownload%2Fv1.2.4%2Fblocklet.json)

## Usage

- Install local from [Store](https://store.blocklet.dev/) or [The official environment](https://clean-wallet-web-jvx-18-180-145-193.ip.abtnet.io/)

## Visuals

![upload page](./screenshots/upload.png)
![password page](./screenshots/password.png)
![download page](./screenshots/download.png)

## Requirement

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

Copyright 2018-2020 ArcBlock

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
