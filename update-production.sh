#!/bin/bash

cd /var/www/acquiregame
git pull
pm2 restart acquire
