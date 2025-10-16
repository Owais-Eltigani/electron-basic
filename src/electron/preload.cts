const { contextBridge, ipcRenderer } = require("electron");

//! only methods will be exposed to the UI from the host OS.
contextBridge.exposeInMainWorld("electron", {
  subscriberStatistics: (callback: (stats: any) => void) => {
    // the frontend process listening to backend on channel "statistics"
    ipcRenderer.on("statistics", (_event: any, data: any) => {
      try {
        callback(data);
      } catch (e) {
        // swallow callback errors to avoid crashing the preload
        console.error("Error in subscriberStatistics callback:", e);
      }
    });
  },
  getStats: () => {
    console.log("Host OS");
  },
});
