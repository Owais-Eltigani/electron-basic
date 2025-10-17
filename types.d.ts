export type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

export type deviceInfo = {
  total: number;
  cpuModel: string;
  clockSpeed: number;
};

export type View = "CPU" | "RAM" | "STORAGE";

export type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

export type EventPayloadMapping = {
  statistics: Statistics;
  deviceInfo: deviceInfo;
  getStaticInfo: Statistics;
  changeView: View;
  sendFrameAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscriberStatistics: (
      callback: (stats: stats) => void
    ) => UnsubscribeFunction;
    getStaticInfo: () => Promise<Statistics>;
    subscribeChangeView: (
      callback: (view: View) => void
    ) => UnsubscribeFunction;
    // sendFrameAction: (payload: FrameWindowAction) => void;
  };
}
