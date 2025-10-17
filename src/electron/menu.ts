import { BrowserWindow, Menu, app } from "electron";
import { isDev, ipcWebContentSend } from "./util.js";

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === "darwin" ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "Quit",
            click: app.quit,
          },
          {
            label: "DevTools",
            click: () => mainWindow.webContents.openDevTools(),
            visible: isDev(),
          },
        ],
      },
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () =>
              ipcWebContentSend("changeView", "CPU", mainWindow.webContents),
          },
          {
            label: "RAM",
            click: () =>
              ipcWebContentSend("changeView", "RAM", mainWindow.webContents),
          },
          {
            label: "STORAGE",
            click: () =>
              ipcWebContentSend(
                "changeView",
                "STORAGE",
                mainWindow.webContents
              ),
          },
        ],
      },
    ])
  );
}
