import type {
  Statistics,
  View,
  FrameWindowAction,
  deviceInfo,
} from "../../types";

declare global {
  interface Window {
    electron: {
      subscriberStatistics: (
        callback: (stats: Statistics) => void
      ) => () => void;
      subscribeChangeView: (callback: (view: View) => void) => () => void;
      getStaticInfo: () => Promise<deviceInfo>;
      sendFrameAction: (action: FrameWindowAction) => void;
    };
  }
}

export {};
