const {
  app, dialog, BrowserWindow, ipcMain,
} = require('electron')
const path = require('path')
const url = require('url')
const childProcess = require('child_process')
// const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const { exec, execSync } = require('child_process')
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
let force_quit = false

let daemonWaitWindow = null

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  log.info('You are trying to run a secondary instance of the wallet! Quit!')
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

function runCliPromised(cmd) {
  return new Promise((resolve, reject) => {
    const procName = process.platform === 'win32' ? `${process.resourcesPath}/crypticcoin-cli.exe` : `${process.resourcesPath}/crypticcoin-cli`
    if (isProcessExists('crypticcoind.exe', 'crypticcoind', 'crypticcoind'))
    {
      let cli = childProcess.execFile(
        procName,
        [
          `-rpcuser=${auth.user}`,
          `-rpcpassword=${auth.pass}`,
          `${cmd}`,
        ],
        {
          stdio: ['inherit', 'pipe', 'pipe'],
          detached: false,
        },
        (err, stdout, stderr) => {
          if (err === null) {
            log.info(stdout.trim())
            resolve(stdout.trim())
          } else {
            const err = stderr.trim().split('\n').pop()
            log.info(err)
            reject(err)
          }
        }
      )
    } else {
      reject("daemon not exists")
    }
  })
}

if (process.env.NODE_ENV !== 'dev') {
  log.info('Creating the CrypticCoin daemon - prod')
  createProc(`${process.resourcesPath}/crypticcoind`)
}

function isProcessExists(win, mac, linux) {
    const plat = process.platform
    const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
    const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
    if (cmd === '' || proc === '') {
      return false
    }
    return execSync(cmd).toString().toLowerCase().indexOf(proc.toLowerCase()) !== -1
}

function retry(fn, retriesLeft = 20, interval = 500) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        if (retriesLeft === 1) {
          // reject('maximum retries exceeded');
          reject(error);
          return;
        }
        setTimeout(() => {
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}


function waitFinished(win, mac, linux) {
  return retry(() => new Promise((resolve, reject) => {
      if (!isProcessExists(win, mac, linux))
      {
        log.info('... process finished')
        resolve(true)
      } else {
        log.info('... waiting for process finish')
        reject(false)
      }
    })
  )
}

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

function rpcStop() {
    // return new Promise((resolve, reject) => resolve("test"))
    return retry(() => runCliPromised("stop"), 10)
      .catch((data) => {
        log.info("Can't exit with 'rpc stop': ", data)
        throw data
      })
}


function killDaemon() {
  if (process.platform === 'win32') {
    return new Promise((resolve, reject) => {
      try {
          log.info('... trying to kill')
            // const appName = 'tor.exe'
            // exec(`taskkill /im ${appName} /t`, (err, stdout, stderr) => {
            exec(`taskkill /f /pid ${ccProcess.pid} & taskkill /im tor.exe`, (err, stdout, stderr) => {
              console.log(stdout)
              console.log(stderr)
            })
      } catch (e) {
        log.info(e.message)
        throw e
      }
      resolve(true)
    })
  }
  else // linux and mac version
  {
    return retry(() => new Promise((resolve, reject) => {
        if (!isProcessExists('crypticcoind.exe', 'crypticcoind', 'crypticcoind'))
        {
            log.info('... kill done')
            resolve(true)
        } else {
            log.info('... trying to kill with SIGINT')
            ccProcess.kill('SIGINT')
            reject(false)
        }
    }), 3, 1000)
    .catch(() => { //new Promise((resolve, reject) => {
        log.info('... trying to kill with SIGKILL')
        ccProcess.kill('SIGKILL')
        // also, kill the tor here!!! cause it wouldn't be killed with forced SIGKILL!
        exec(`pkill tor`, (err, stdout, stderr) => {})
        // just for promise chaining:
        return sleep(100)
    })
  }
}

function ensureDaemonStopped () {
  // createDaemonWaitWindow()
  return rpcStop()
    .then(() => {
      return waitFinished('crypticcoind.exe', 'crypticcoind', 'crypticcoind').then(() => {
        log.info("final sleep")
        return sleep(3000)
      })
    })
    .catch(() => {
        return killDaemon()
        .then(() => {
          return waitFinished('crypticcoind.exe', 'crypticcoind', 'crypticcoind').then(() => {
            log.info("final sleep")
            return sleep(3000)
          })
        })
    })
    .then(() =>  { log.info('Cryptic daemon closed'); /* daemonWaitWindow.close() */ } )
    .catch(() => log.info('Error!! Fail to close cryptic daemon! Kill tor and/or crypticcoin processes manually!') )
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

  mainWindow.on('close', (e) => {
    if(!force_quit){
        e.preventDefault();

        if (dev)
        {
          force_quit = true;
          app.quit()
          return
        }

        ensureDaemonStopped().then(() => {
          force_quit = true;
          app.quit()
        })
    }
  })

  mainWindow.on('closed', () => {
      mainWindow = null
  })
}

ipcMain.on('request-clean-reindex', (event, arg) => {
  ensureDaemonStopped().then(() => {
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
  ensureDaemonStopped().then(() => {
    if (process.platform === 'win32') {
      createProc(`${process.resourcesPath}/crypticcoind.exe`, ['-reindex'])
    } else {
      createProc(`${process.resourcesPath}/crypticcoind`, ['-reindex'])
    }
  })
})

ipcMain.on('request-rescan', (event, arg) => {
  ensureDaemonStopped().then(() => {
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

function createDaemonWaitWindow() {
  daemonWaitWindow = new BrowserWindow({
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
  daemonWaitWindow.loadURL(indexPath)

  daemonWaitWindow.once('ready-to-show', () => {
    daemonWaitWindow.show()
  })

  // ipcMain.once('finalized-loading', () => {
  //   loadingWindow.close()
  //   loadingWindow = null

  //   mainWindow.show()
  // })

  daemonWaitWindow.on('closed', () => {
    daemonWaitWindow = null
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

// app.on('window-all-closed', () => {
//     if(process.platform !== 'darwin')
//       app.quit()
// })

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
