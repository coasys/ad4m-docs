---
sidebar_position: 3
---

# Setup Proxy Service

## Configure Domain

Add A record `*.proxy.ad4m.dev`, the value is server IP.
Add A record `proxy.ad4m.dev`, the value is server IP.

You can now login the server with SSH,

```
ssh ubuntu@proxy.ad4m.dev
```

## Install Node and localtunnel

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v16
```

```
git clone https://github.com/StyleT/mytunnel-server.git
cd mytunnel-server
npm install
```

## Run localtunnel

```
# make a session and keep open even logout from SSH, ctrl a + d switch to the SSH session, screen -r lt got to the localtunnel session
screen -S lt
DEBUG=* bin/server.js --domain proxy.ad4m.dev --port 3000 --secure
```

## Use Caddy




## Install and Configure Nginx

If you already use Caddy, no need to use Nginx, skip this step.

```shell
sudo apt update
sudo apt install nginx
```

Edit `/etc/nginx/nginx.conf`

```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 10000;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        #tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        #ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        #ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;
        
        ##
        # Gzip Settings
        ##

        gzip on;

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        #include /etc/nginx/sites-enabled/*;
}
```

Add file `/etc/nginx/conf.d/site.conf`, 

```shell
cd /etc/nginx/conf.d
curl -LJO https://raw.githubusercontent.com/localtunnel/nginx/master/site.conf
```

Now let's get new certificates using letsencrypt, so that it can be used in above `site.conf`.

```shell
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx

certbot --server https://acme-v02.api.letsencrypt.org/directory -d *.proxy.ad4m.dev --manual --preferred-challenges dns-01 certonly
# follow the pompts, you should get certificates at 
# /etc/letsencrypt/live/proxy.ad4m.dev/fullchain.pem
# /etc/letsencrypt/live/proxy.ad4m.dev/privkey.pem
```

Let's change these lines in `/etc/nginx/conf.d/site.conf`,

```
ssl_certificate      /etc/letsencrypt/live/proxy.ad4m.dev/fullchain.pem;
ssl_certificate_key  /etc/letsencrypt/live/proxy.ad4m.dev/privkey.pem;
```

And start Nginx,

```shell
systemctl enable nginx
systemctl restart nginx
systemctl status nginx


## Firewall Settings


Ensure 80, 443, 1000~65535 is open with Firewall, Security Group and ufw

```shell
ufw allow https
ufw allow http
ufw allow ssh
ufw allow 1000:65535/tcp

ufw enable

ufw status
```
