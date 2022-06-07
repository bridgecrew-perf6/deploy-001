#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm i 
npx playwright install
npx playwright install-deps