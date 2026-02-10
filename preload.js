const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  addBooking: (booking) => ipcRenderer.invoke('add-booking', booking),
  getBookings: () => ipcRenderer.invoke('get-bookings')
});
