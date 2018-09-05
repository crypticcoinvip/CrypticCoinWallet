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


Assembly installer for Mac OS

Step 0
- run Prod commands

Step 1
- copy sprout-proving.key and sprout-verifying.key to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 2
- copy ./darwin/*/* directory to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 3
- copy crypticcoind to ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app/Contents/Resources/

Step 4
pkgbuild --component ./builds/crypticcoin-wallet-darwin-x64/crypticcoin-wallet.app --scripts ./scripts  --install-location /Applications CrypticCoin.pkg


Assembly installer for Windows


