import { BrowserWindow, app } from "electron";
import path from "path";
import { ipcHandler, ipcMainOn, isDev } from "./util.js";
import { deviceInfo, pollingResources } from "./resourceManager.js";
import { createTray } from "./tray.js";

// run when the app is ready
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    title: "System Monitor", // Add your custom app title here
    width: 1200,
    height: 800,
    //? the bridge between backend front of the app "IPCRenderer"
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron", "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },

    //! disabling the frame will toggle off the window control buttons and you'll have to implement them
    // frame: false,
  });

  if (isDev()) {
    //? dev mode - load the development server
    mainWindow.loadURL("http://localhost:5173");
  } else {
    //? production code - load the built HTML file
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }

  pollingResources(mainWindow);
  createTray(mainWindow);

  ipcMainOn("sendFrameAction", (payload) => {
    switch (payload) {
      case "CLOSE":
        mainWindow.close();
        break;
      case "MAXIMIZE":
        mainWindow.maximize();
        break;
      case "MINIMIZE":
        mainWindow.minimize();
        break;
    }
  });

  ipcHandler("deviceInfo", () => {
    return deviceInfo();
  });
});
