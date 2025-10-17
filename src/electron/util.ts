import { ipcMain } from "electron";

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
  payload: EventPayloadMapping,
  webContents: webContents
) {
  webContents.send(key, payload);
}
