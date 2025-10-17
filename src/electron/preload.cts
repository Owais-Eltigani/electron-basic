const { contextBridge, ipcRenderer } = require("electron");

// Import types
import type {
  EventPayloadMapping,
  Statistics,
  View,
  FrameWindowAction,
  deviceInfo,
} from "../../types.js";

// Define the electron API interface
interface ElectronAPI {
  subscriberStatistics: (callback: (stats: Statistics) => void) => () => void;
  subscribeChangeView: (callback: (view: View) => void) => () => void;
  getStaticInfo: () => Promise<deviceInfo>;
  sendFrameAction: (action: FrameWindowAction) => void;
}

//! only methods will be exposed to the UI from the host OS.
contextBridge.exposeInMainWorld("electron", {
  subscriberStatistics: (callback: (stats: Statistics) => void) =>
    ipcOn("statistics", (stats) => {
      callback(stats);
    }),
  subscribeChangeView: (callback: (view: View) => void) =>
    ipcOn("changeView", (view) => {
      callback(view);
    }),
  getStaticInfo: () => ipcInvoke("deviceInfo"),
  sendFrameAction: (action: FrameWindowAction) =>
    ipcSend("sendFrameAction", action),
} satisfies ElectronAPI);
// });

//* types
function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: any, payload: EventPayloadMapping[Key]) => callback(payload);
  ipcRenderer.on(key, cb);
  return () => ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  ipcRenderer.send(key, payload);
}
