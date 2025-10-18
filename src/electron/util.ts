import { app, ipcMain } from "electron";
import type { WebContents } from "electron";
import type { EventPayloadMapping } from "../../types.js";
import path from "path";

export const isDev = () => {
  return process.env.NODE_ENV === "development";
};

export function ipcHandler<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, () => handler());
}
export function ipcWebContentSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key],
  webContents: WebContents
) {
  webContents.send(key, payload);
}

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function getAssetPath() {
  if (isDev()) {
    return path.join(app.getAppPath(), "/src/ui/assets/");
  } else {
    // In production, assets are in extraResources
    return path.join(process.resourcesPath, "/src/ui/assets/");
  }
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (_, payload) => {
    return handler(payload);
  });
}
