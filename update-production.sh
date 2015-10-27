#!/bin/bash

cd /var/www/acquiregame
git pull
cd server
npm install
pm2 restart acquire
