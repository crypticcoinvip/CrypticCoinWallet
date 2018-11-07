const {
  app, dialog, BrowserWindow, ipcMain,
} = require('electron')
const path = require('path')
const url = require('url')
const childProcess = require('child_process')
// const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const { exec } = require('child_process')

require('electron-context-menu')({
  showInspectElement: false,
  prepend: (params, browserWindow) => [{
    visible: params.mediaType === 'image',
  }],
})

// autoUpdater.autoDownload = false
//
// autoUpdater.logger = log
// autoUpdater.logger.transports.file.level = 'info'

log.info('App starting...')

let mainWindow

let dev = false
if (
  process.defaultApp
  || /[\\/]electron-prebuilt[\\/]/.test(process.execPath)
  || /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true
}

const generator = () => Math.random()
  .toString(36)
  .slice(-8)

const auth = { pass: generator(), user: generator(), loadingProgress: 0 }

global.sharedObj = auth

let ccProcess

const createProc = (processPath) => {
  ccProcess = childProcess.spawn(
    processPath,
    [
      '-daemon',
      `-rpcuser=${auth.user}`,
      `-rpcpassword=${auth.pass}`,
      '-printtoconsole',
    ],
    {
      stdio: ['inherit', 'pipe', 'inherit'],
      detached: true,
    },
  )
  log.info('CrypticCoin Process running @ ', ccProcess.pid + 1, ' pid')
  const readable = ccProcess.stdout
  ccProcess.unref()
  readable.on('readable', () => {
    let chunk
    while ((chunk = readable.read()) !== null) {
      const loadRegex = /\d+/
      const chunkString = chunk.toString()
      if (chunkString.includes('Loading block index')) {
        const [number] = chunkString.match(loadRegex)
        auth.loadingProgress = number
      }
      log.log('loading progress: ', auth.loadingProgress, '%')
    }
  })
}

const runCli = (processPath, cmd) => {
  let cli = childProcess.spawn(
    processPath,
    [
      `-rpcuser=${auth.user}`,
      `-rpcpassword=${auth.pass}`,
      `${cmd}`,
    ],
    {
      stdio: ['inherit', 'pipe', 'inherit'],
      detached: false,
    },
  )
  cli.unref()
}

if (process.env.NODE_ENV !== 'dev') {
  log.info('Creating the CrypticCoin daemon - prod')
  createProc(`${process.resourcesPath}/crypticcoind`)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    frame: true,
    title: 'CrypticCoin',
    resizable: true,
    fullscreenable: false,
    'use-content-size': true,
    closable: true,
  })

  mainWindow.setMenu(null)

  mainWindow.setTitle('CrypticCoin')

  let indexPath
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    })
  }

  mainWindow.loadURL(indexPath)

  if (dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('finalized-loading', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    log.log('Killing CrypticCoin process')
    while (ccProcess && !ccProcess.killed) {
      try {
        if (process.platform === 'win32') {
          //process.kill(ccProcess.pid, 'SIGKILL')
          runCli(`${process.resourcesPath}/crypticcoin-cli.exe`, 'stop')
          const appName = 'tor.exe'
          exec(`taskkill /im ${appName} /t`, (err, stdout, stderr) => {
            if (err) {
              throw err
            }

            console.log('stdout', stdout)
            console.log('stderr', stderr)
          })

          break
        } else {
          process.kill(-(ccProcess.pid + 1), 'SIGINT')
        }
      } catch (e) {
        console.log(e.message)
        break
      }
    }

    mainWindow = null
  })
}

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 825,
    height: 560,
    show: false,
    frame: false,
    toolbar: false,
    resizable: false,
    fullscreenable: false,
    transparent: true,
  })

  let indexPath
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'loading.html',
      slashes: true,
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'loading.html'),
      slashes: true,
    })
  }
  loadingWindow.loadURL(indexPath)

  loadingWindow.once('ready-to-show', () => {
    loadingWindow.show()
  })

  ipcMain.once('finalized-loading', () => {
    loadingWindow.close()
    loadingWindow = null

    mainWindow.show()
  })

  loadingWindow.on('closed', () => {
    loadingWindow = null
  })
}

app.on('ready', () => {
  // autoUpdater
  //   .checkForUpdatesAndNotify()
  //   .then((value) => {
  //     log.info(value)
  //     log.info(
  //       `Checking update - Info: ${(value
  //         && value.updateInfo.stagingPercentage)
  //       || -1}%`,
  //     )
  //   })
  //   .then(() => {
  //     createLoadingWindow()
  //     createWindow()
  //   })
  //   .catch((e) => {
  //     createLoadingWindow()
  //     createWindow()
  //   })
  createLoadingWindow()
  createWindow()  
})

/*
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
})
*/

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createLoadingWindow()
    createWindow()
  }
})

// autoUpdater.on('update-available', () => {
//   dialog.showMessageBox({
//     type: 'info',
//     title: 'New version found',
//     message: 'New version found, do you want install it now?',
//     buttons: ['Yes', 'No'],
//   }, (buttonIndex) => {
//     if (buttonIndex === 0) {
//       autoUpdater.downloadUpdate();
//     } else { }
//   });
// });

// autoUpdater.on('update-not-available', () => {
//   dialog.showMessageBox({
//     title: 'No Updates',
//     message: 'Current version is up-to-date.'
//   })
// })

// autoUpdater.on('error', (error) => {
//   dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
// });

// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   log.info(log_message);
// })

// autoUpdater.on('update-downloaded', () => {
//   dialog.showMessageBox({
//     title: 'Install Updates',
//     message: 'Updates downloaded, application will be quit for update...',
//   }, () => {
//     setImmediate(() => autoUpdater.quitAndInstall())
//   })
// })
