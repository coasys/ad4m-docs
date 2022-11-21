---
sidebar_position: 1
---

# Setup Proxy Service

## Configure Domain

Add A record `*.proxy.ad4m.dev`, the value is server IP.
Add A record `proxy.ad4m.dev`, the value is server IP.

You can now login the server with SSH,

```
ssh ubuntu@proxy.ad4m.dev
```

## Install Rust and localtunnel

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

```shell
cargo install localtunnel

localtunnel server --domain proxy-sg.ad4m.dev --port 3000 --proxy-port 3001 --secure --require-auth
```

*Known issues:*

> failed to run custom build command for `openssl-sys v0.9.77`

Install libssl,
```shell
sudo apt install libssl-dev
```

## Install Node and localtunnel (deprecated!)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v16
```

```
git clone https://github.com/StyleT/mytunnel-server.git
cd mytunnel-server
npm install
```

## Run localtunnel with systemd

Add a systemd service `/etc/systemd/system/localtunnel.service` with following content,

```
Description=localtunnel

[Service]
Environment=DEBUG=*
ExecStart=/ubuntu/.nvm/versions/node/v16.17.1/bin/node /ubuntu/lt/mytunnel-server/bin/server.js --domain proxy.ad4m.dev --port 3000 --secure > /ubuntu/lt/proxy-log 2>&1
Restart=always
RestartSec=10
StandardOutput=append:/ubuntu/lt/proxy-log
StandardError=append:/ubuntu/lt/proxy-log

[Install]
WantedBy=multi-user.target
```

Start the service,

```shell
systemctl enable localtunnel.service
systemctl start localtunnel.service
systemctl status localtunnel.service

# view logs
journalctl -f -u localtunnel
```

## Setup Caddy proxy

Install Caddy,

```shell
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Caddyfile,

```
proxy.ad4m.dev {
  reverse_proxy http://127.0.0.1:3000
}

*.proxy.ad4m.dev {
  reverse_proxy http://127.0.0.1:3000
  tls {
    on_demand
  }
}
```

```shell
caddy stop
caddy start
```

## Configure Firewall

```shell
ufw allow https
ufw allow http
ufw allow ssh
ufw allow 1000:65535/tcp

ufw enable

ufw status
```

Note: *You may also need to open the ports with Firewall settings from cloud provider.*
