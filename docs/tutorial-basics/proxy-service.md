---
sidebar_position: 3
---

# Setup Proxy Service

proxy.ad4m.dev (and *.proxy.ad4m.dev) points to that server

```shell
sudo apt update
sudo apt install nginx nodejs npm
```


```shell
cd /var/www/html/
sudo git clone https://github.com/localtunnel/server
sudo npm install
```


QA:

If you can run npm install from sudo or as root,

```shell
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
```