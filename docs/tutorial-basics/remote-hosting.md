---
sidebar_position: 1
---

# Remote Hosting

Run ad4m GraphQL services on a public server, test on these platforms, 
* Ubuntu 22.04

## Run with binaries

### AD4M

**Prepare ad4m binary,**

```shell
git clone https://github.com/fluxsocial/remote-ad4m.git
cd remote-ad4m
./scripts/setup-binaries.sh # terminate it before run ad4m with systemd
```

_Known Issues:_

Issue: libssl.so.1.1: cannot open shared object file: No such file or directory

Fix:

```shell
wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
```

**Run binary with systemd,**

```shell
touch /etc/systemd/system/ad4m.service
```

Add following config to ad4m.service,
```
[Unit]
Description=ad4m

[Service]
ExecStart=/bin/bash -c 'killall holochain || killall lair-keystore || (./root/ad4m/remote-ad4m/scripts/setup-binaries.sh > /root/ad4m/remote-ad4m/log 2>&1)'
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start the service,

```shell
systemctl enable ad4m.service
systemctl start ad4m.service
systemctl status ad4m.service

# view logs
journalctl -f -u ad4m
```

### Caddy

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

## Run with Docker

