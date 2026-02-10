const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { bookRoom, getBookings } = require('./booking');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// IPC handlers
ipcMain.handle('get-bookings', async () => {
  return new Promise(resolve => getBookings(resolve));
});

ipcMain.handle('book-room', async (event, data) => {
  return new Promise(resolve => 
    bookRoom(data.room_number, data.booked_by, data.start_time, data.end_time, resolve)
  );
});
