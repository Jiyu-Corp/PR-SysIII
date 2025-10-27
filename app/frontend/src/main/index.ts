import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import prsys from '../../resources/prsys.png?asset'
import startNest from './nestConfig'
import axios from 'axios'

let nestProcess;
const fs = require('fs');

async function createWindow(): Promise<void> {
    nestProcess = startNest();

    console.log("Waiting for backend...");
    await waitBackendHealthCheck();
    console.log("Backend ready!");

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        icon: prsys,
        webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

}

ipcMain.handle('generate-pdf', async (event, { html, defaultFilename = 'relatorio.pdf' }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Salvar relatório como PDF',
      defaultPath: defaultFilename,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });

    if (canceled || !filePath) return { canceled: true };

    const pdfWin = new BrowserWindow({
      show: false,
      webPreferences: {
        sandbox: false,
      }
    });

    await pdfWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

    await pdfWin.webContents.executeJavaScript('document.fonts ? document.fonts.ready : Promise.resolve()');

    const pdfOptions = {
      marginsType: 1,
      printBackground: true,
      pageSize: 'A4' as any,
      landscape: false,
    };

    const pdfBuffer = await pdfWin.webContents.printToPDF(pdfOptions);

    fs.writeFileSync(filePath, pdfBuffer);

    pdfWin.close();

    return { canceled: false, filePath };
  } catch (err) {
    console.error('generate-pdf error', err);
    return { canceled: true, error: String(err) };
  }
});

 function waitCooldown(cooldownInSeconds: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), cooldownInSeconds * 1000));
}

async function waitBackendHealthCheck(): Promise<boolean> {
    try {
        await waitCooldown(1);
        const healthCheckRes = await axios({
            baseURL: "http://localhost:3001",
            url: "health",
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const healthCheck = healthCheckRes.data;

        return healthCheck;
    } catch(err) {
        return await waitBackendHealthCheck();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('before-quit', () => {
  if (nestProcess) {
    nestProcess.kill();
  }
});