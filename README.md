Dev version
- npm install
- nano ./src/dev-config.json - change user\pass
- npm run dev


Prod
- rm -rf builds dist
- yarn
- yarn build
- yarn postpackage


Assembly installer for Linux

Step 0
- run Prod commands
- rm -rf ubuntu-build

Step 1
- mkdir -p ubuntu-build && cd ubuntu-build
- mkdir -p DEBIAN && mkdir -p usr/lib/crypticcoin-wallet

Step 2
- cp -r ../builds/crypticcoin-wallet-linux-x64/* usr/lib/crypticcoin-wallet

Step 3
- copy sprout-proving.key and sprout-verifying.key to usr/lib/crypticcoin-wallet/resources

Step 4
- cp ../ubuntu/crypticcoin.desktop usr/lib/crypticcoin-wallet/resources
- cp ../ubuntu/tor usr/lib/crypticcoin-wallet/resources
- cp ../ubuntu/postinst DEBIAN
- cp ../ubuntu/control DEBIAN

Step 5
- copy crypticcoind to usr/lib/crypticcoin-wallet/resources

Step 6
- cd .. && dpkg-deb --build ubuntu-build

Step 7 (Install package)
- sudo apt remove --purge crypticcoin-debian && rm -rf builds
- sudo dpkg -i ubuntu-build.deb

Assembly installer for Mac OS

Step 0
- run Prod commands

Step 1
- copy sprout-proving.key and sprout-verifying.key to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 2
- copy ./darwin/*/* directory to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 3
- copy libevent and openssl libraries to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 4
- copy crypticcoind to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 5
pkgbuild --component ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app --scripts ./scripts  --install-location /Applications CrypticCoin.pkg


Assembly installer for Windows


