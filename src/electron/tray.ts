import { BrowserWindow, Menu, Tray, app } from "electron";
import path from "path";
import { isDev } from "./util.js";

export function createTray(mainWindow: BrowserWindow) {
  let trayIconPath: string;

  if (isDev()) {
    // Development mode - use original assets
    trayIconPath = path.join(
      app.getAppPath(),
      "/src/ui/assets/",
      process.platform === "darwin"
        ? "Tray Icon Template.png"
        : "Tray Icon from Electron Course.png"
    );
  } else {
    // Production mode - use build assets
    trayIconPath = path.join(
      app.getAppPath(),
      "/build/",
      process.platform === "darwin" ? "tray-template.png" : "tray-colored.png"
    );
  }

  const tray = new Tray(trayIconPath);

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          mainWindow.show();
          if (process.platform === "darwin" && app.dock) {
            app.dock.show();
          }
        },
      },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );
}
