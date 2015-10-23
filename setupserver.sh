#!/bin/bash

# This is a script that will set up node.js and nginx on a DigitalOcean server running Ubuntu 15.10.
# It also installs pm2, which is a process manager for node.js.
# Use it like `sudo -H pm2 start acquire.js`

sudo touch /var/swap.img
sudo chmod 600 /var/swap.img
sudo dd if=/dev/zero of=/var/swap.img bs=1024k count=1000
sudo mkswap /var/swap.img
sudo bash -c 'echo "/var/swap.img none swap sw 0 0" >> /etc/fstab'
sudo swapon /var/swap.img

sudo apt update
sudo apt -y full-upgrade

wget -qO- https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt -y install mosh vim curl git nginx nodejs build-essential
wget -qO- https://npmjs.com/install.sh | sudo bash -

sudo npm install pm2 -g

cd /var/www
sudo git clone https://github.com/stephenwade/acquiregame.git
sudo chown -R $(whoami) acquiregame

cd /var/www/acquiregame/server
npm update
sudo -H pm2 start acquire.js
sudo -H pm2 startup systemd

sudo sed -i \
  -e '/\s*#.*$/d' \
  -e '/^\s*$/d' \
  -e 's:root /var/www/html:root /var/www/acquiregame/client:' \
  -e 's/server_name _/server_name acquire.stephenwade.me/' \
  -e '/^}$/d' \
  /etc/nginx/sites-available/default
sudo bash -c 'printf "\tlocation /game {
\t\tproxy_set_header Upgrade \$http_upgrade;
\t\tproxy_set_header Connection "upgrade";
\t\tproxy_http_version 1.1;
\t\tproxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
\t\tproxy_set_header Host \$host;
\t\tproxy_pass http://127.0.0.1:8001;
\t}
}" >> /etc/nginx/sites-available/default'
sudo systemctl restart nginx

cd
echo '#!/bin/bash' > update
echo 'cd /var/www/acquiregame' >> update
echo 'git pull' >> update
echo 'sudo -H pm2 restart acquire' >> update
chmod +x update
