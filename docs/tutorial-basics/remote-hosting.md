---
sidebar_position: 1
---

# Remote Hosting

Run ad4m GraphQL services on a public server, test on these platforms, 
* Ubuntu

## Start ad4m service

Download ad4m-host binary and change permission to be executable, you many need to change the version.
```shell
wget -O ad4m https://github.com/perspect3vism/ad4m-host/releases/download/v0.0.18/ad4m-linux-x64
chmod +x ./ad4m
```

Start a new background session, then initialize and run ad4m service,

```shell
# it gives us a background session, named ad4m, exit the session with `ctrl+a+d`
screen -S ad4m

# allow connection bypass firewall
sudo ufw allow 4000

# init ad4m
./ad4m init

# run service
./ad4m serve
```

## Secure connection

TODO support wss with niginx,

Download nginx, and bypass firewall,
```shell
sudo apt install nginx
sudo systemctl start nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
```
Go to website `http://<your-ip>`, the nginx welcome page should be shown if everything works.

Generate self-signed certificate with `openssl`,

```shell
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-ad4m.key -out /etc/ssl/certs/nginx-ad4m.crt
```

Follow [this guide](https://github.com/nicokaiser/nginx-websocket-proxy) to configure the wss in nginx.

## Change endpoint in client

Search in client code, replace `ws://localhost:4000/graphql` to `ws://<your-ip>:4000/graphql`, use wss if secure connection is configured.
For example, [flux](https://github.com/fluxsocial/flux) and its dependency [perspective-views](https://github.com/fluxsocial/perspective-views) see [these changes](https://github.com/fluxsocial/flux/compare/dev...remote-host), note that chat-view and flux is changed but hardcoded to a fixed ip address, you need to update the ip, and use your own chat-view package.

TODO make the endpoint in chat-view read from props.


## AD4M

```shell
git clone https://github.com/fluxsocial/remote-ad4m.git
cd remote-ad4m
./scripts/setup-binaries.sh
```

fix:

libssl.so.1.1: cannot open shared object file: No such file or directory

```
wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb

sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
```

## Caddy

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
your-subdomain.example.com {
  reverse_proxy http://127.0.0.1:12000
  tls {
    on_demand
  }
}
```

```shell
caddy stop
caddy start
```