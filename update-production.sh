#!/bin/bash

cd /var/www/acquiregame
git pull
cd server
npm update
cd ../client
bower update
pm2 restart acquire
