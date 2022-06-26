---
sidebar_position: 3
---

# Setup Proxy Service

## Install Node

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v16
```

## Install localtunnel

```
git clone https://github.com/StyleT/mytunnel-server.git
cd mytunnel-server
npm install
```

## Run local tunnel

```
# make a session and keep open even logout from SSH, ctrl a + d switch to the SSH session, screen -r lt got to the localtunnel session
screen -S lt
DEBUG=* bin/server.js --domain proxy.threechain.xyz --port 3000 --secure
```

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

## Firewall


ensure 80, 443, 1000~65535 is open.

copy site.conf from localtunnel-nginx.

if ufw is used, allow enable it not block the ports with 

```shell
ufw allow https
ufw allow http
ufw status
ufw allow 1000:65535/tcp
```

## Site

```shell
cd /etc/nginx/conf.d
curl -LJO https://raw.githubusercontent.com/localtunnel/nginx/master/site.conf
