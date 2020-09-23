#!/bin/bash

# nvm（node version manager）を読み込み、node（.nvmrc 内のバージョン）をインストールし、npm パッケージをインストールします。
[ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh" && nvm use
# まだインストールされていない場合は npm をインストールする
[ ! -d "node_modules" ] && npm install

npm run generate
aws s3 sync dist/ s3://www.help-knowledge.com --profile=help-ui