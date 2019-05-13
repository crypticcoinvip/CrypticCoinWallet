const {
  app, dialog, BrowserWindow, ipcMain,
} = require('electron')
const path = require('path')
const url = require('url')
const childProcess = require('child_process')
// const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const { exec } = require('child_process')
const fs = require('fs-extra')

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

let mainWindow = null

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  log.info('You are trying to run secondary instance of wallet! Quit!')
  app.quit();
  return;
}

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

const createProc = (processPath, params = []) => {
  ccProcess = childProcess.spawn(
    processPath,
    [
      ...params,
      `-rpcuser=${auth.user}`,
      `-rpcpassword=${auth.pass}`,
      // '-printtoconsole',
    ],
    {
      stdio: ['inherit', 'pipe', 'inherit'],
      detached: true,
    },
  )
  log.info('CrypticCoin Process running @ ', ccProcess.pid, ' pid')
  const readable = ccProcess.stdout
  ccProcess.unref()
  readable.on('readable', () => {
    let chunk
    while ((chunk = readable.read()) !== null) {
      const loadRegex = /\d+/
      const chunkString = chunk.toString()
      try {
        if (chunkString.includes('Loading block index')) {
          const [number] = chunkString.match(loadRegex)
          auth.loadingProgress = number
        }
        log.log('loading progress: ', auth.loadingProgress, '%')
      } catch (e) { }
    }
  })
}

const runCli = (processPath, cmd, sync) => {
  if (sync === true) {
    childProcess.spawnSync(
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
  } else {
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
}

if (process.env.NODE_ENV !== 'dev') {
  log.info('Creating the CrypticCoin daemon - prod')
  createProc(`${process.resourcesPath}/crypticcoind`)
}

function isFinished(win, mac, linux) {
  let tries = 50
  return new Promise(function cb(resolve, reject) {
    const plat = process.platform
    const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
    const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
    if (cmd === '' || proc === '') {
      // log.info('trace isFinished 1')
      resolve(true)
    }
    exec(cmd, (err, stdout, stderr) => {
      if (stdout.toLowerCase().indexOf(proc.toLowerCase()) === -1) {
        // log.info('trace isFinished 2')
        resolve(true)
      } else {
        if (--tries > 0) {
          // log.info('trace isFinished 3')
          setTimeout(function () {
            cb(resolve, reject);
          }, 500);
        } else {
          // log.info('trace isFinished 4')
          resolve(false)
        }
      }
    })
  })
}

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

function isFinishedDaemonAndCli() {

  return isFinished('crypticcoind.exe', 'crypticcoind', 'crypticcoind').then(() => {
    return isFinished('crypticcoin-cli.exe', 'crypticcoin-cli', 'crypticcoin-cli').then(() => {
      log.info('waiting 5s...')
      /// ! important, otherwise node don't unlock pidlock after killing (sometimes)
      return sleep(5000);
    })
  })
}

function killDaemon() {
  log.log('Killing CrypticCoin process')

  // let tries = 20
  while (ccProcess && (!ccProcess.killed)) {
    log.info('trying to call rpc "stop"...')

    try {
      if (process.platform === 'win32') {
        runCli(`${process.resourcesPath}/crypticcoin-cli.exe`, 'stop', true)
        // const appName = 'tor.exe'
        // exec(`taskkill /im ${appName} /t`, (err, stdout, stderr) => {
        //   if (err) {
        //     throw err
        //   }

        //   console.log('stdout', stdout)
        //   console.log('stderr', stderr)
        // })

        break
      } else {
//          process.kill(-(ccProcess.pid), 'SIGINT')
        runCli(`${process.resourcesPath}/crypticcoin-cli`, 'stop', true)
        break
      }
    } catch (e) {
      console.log(e.message)
      break
    }
  }

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
    killDaemon()

    isFinishedDaemonAndCli().then(() => {
      log.info("Daemon stopped")
    })
    mainWindow = null
  })
}

ipcMain.on('request-clean-reindex', (event, arg) => {

  killDaemon()

  isFinishedDaemonAndCli().then(() => {
    let paths = []
    if (process.platform === 'win32') {
      paths = [`${process.env.USERPROFILE}\\AppData\\Roaming\\Crypticcoin\\blocks`, `${process.env.USERPROFILE}\\AppData\\Roaming\\Crypticcoin\\chainstate`, `${process.env.USERPROFILE}\\AppData\\Roaming\\Crypticcoin\\dpos`, `${process.env.USERPROFILE}\\AppData\\Roaming\\Crypticcoin\\masternodes`]
    } else if (process.platform === 'linux') {
      paths = [`${process.env.HOME}/.crypticcoin/blocks`, `${process.env.HOME}/.crypticcoin/chainstate`, `${process.env.HOME}/.crypticcoin/dpos`, `${process.env.HOME}/.crypticcoin/masternodes`]
    } else if (process.platform === 'darwin') {
      paths = [`${process.env.HOME}/Library/Application\ Support/CrypticCoin/blocks`, `${process.env.HOME}/Library/Application\ Support/CrypticCoin/chainstate`, `${process.env.HOME}/Library/Application\ Support/CrypticCoin/dpos`, `${process.env.HOME}/Library/Application\ Support/CrypticCoin/masternodes`]
    }

    for (let k in paths) {
      fs.removeSync(paths[k])
    }

    mainWindow.close()
  })
})

ipcMain.on('request-reindex', (event, arg) => {

  killDaemon()

  isFinishedDaemonAndCli().then(() => {
    if (process.platform === 'win32') {
      createProc(`${process.resourcesPath}/crypticcoind.exe`, ['-reindex'])
    } else {
      createProc(`${process.resourcesPath}/crypticcoind`, ['-reindex'])
    }
  })
})

ipcMain.on('request-rescan', (event, arg) => {

  killDaemon()

  isFinishedDaemonAndCli().then(() => {
    if (process.platform === 'win32') {
      createProc(`${process.resourcesPath}/crypticcoind.exe`, ['-rescan'])
    } else {
      createProc(`${process.resourcesPath}/crypticcoind`, ['-rescan'])
    }
  })
})

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
