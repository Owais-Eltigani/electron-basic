import { BrowserWindow, Tray, app } from "electron";
import path from "path";
import { getAssetPath, ipcHandler, isDev } from "./util.js";
import { deviceInfo, pollingResources } from "./resourceManager.js";
import { createMenu } from "./menu.js";
import { createTray } from "./tray.js";

// run when the app is ready
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    //! the bridge between backend front of the app "IPCRenderer"
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron", "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // determine where is exe of the file in computer.

  if (isDev()) {
    //? dev mode - load the development server
    mainWindow.loadURL("http://localhost:5173");
  } else {
    //? production code - load the built HTML file
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }

  pollingResources(mainWindow);
  createTray(mainWindow);

  // new Tray(
  //   path.join(
  //     getAssetPath(),
  //     process.platform === "darwin" ? "trayIcon.png" : "trayIconColored"
  //   )
  // );

  ipcHandler("deviceInfo", () => {
    return deviceInfo();
  });
});
