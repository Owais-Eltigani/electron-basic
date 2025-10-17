import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getStaticInfo, pollingResources } from "./resourceManager.js";

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
  ipcMain.handle("getStaticInfo", () => {
    return getStaticInfo();
  });
});
