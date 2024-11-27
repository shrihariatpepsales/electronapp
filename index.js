const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allows Node.js modules in the renderer process
    },
  });

  // Enable content protection for the main window
  mainWindow.setContentProtection(true);

  mainWindow.loadURL('https://app.pepsales.xyz/');

  // Handle new window creation
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Create the new window
    const childWindow = new BrowserWindow({
      parent: mainWindow, // Optional: set parent to mainWindow
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    // Enable content protection for the new window
    childWindow.setContentProtection(true);

    // Load the URL in the new window
    childWindow.loadURL(url);

    // Return an empty object to allow the window creation to proceed
    return { action: 'deny' }; // Deny default behavior, handled manually
  });

  // Optional: Handle 'web-contents-created' to catch any other scenarios
  app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'window') {
      const window = BrowserWindow.fromWebContents(contents);
      if (window) {
        // Apply content protection to all new windows
        window.setContentProtection(true);
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    // Enable content protection for the main window
    mainWindow.setContentProtection(true);

    mainWindow.loadURL('https://app.pepsales.xyz/');
  }
});
