const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 360,
    minHeight: 640,
    icon: path.join(__dirname, 'public/vite.svg'), // You can change this to a real icon
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // For ease of use in local
    },
    autoHideMenuBar: true
  });

  // Loading the App
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    // Under development, runs vite dev server
    win.loadURL('http://localhost:3000')
      .catch(() => {
        // Fallback if dev server is not running
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
      });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
