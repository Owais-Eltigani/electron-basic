const { contextBridge, ipcRenderer } = require("electron");

//! only methods will be exposed to the UI from the host OS.
contextBridge.exposeInMainWorld("electron", {
  subscriberStatistics: (callback) => {
    // the frontend process listening to backend on channel "statistics"
    return ipcOn("statistics", (stats) => {
      try {
        callback(stats);
      } catch (e) {
        // swallow callback errors to avoid crashing the preload
        console.error("Error in subscriberStatistics callback:", e);
      }
    });
  },
  getStaticInfo: () => {
    // console.log("Host OS");
    ipcInvoke("getStaticInfo");
  },
} satisfies Window["electron"]);

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
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  ipcRenderer.on(key, cb);
  return () => ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  ipcRenderer.send(key, payload);
}
