import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "../ui/useStatics";
import { Chart } from "./Chart";
import type { View, deviceInfo } from "../../types";

function App() {
  const deviceInfo = useStaticData();
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );
  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );
  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  );
  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
      default:
        return cpuUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <div className="App">
      <div className="charts-grid">
        <div className="chart-item">
          <div className="chart-header">
            <h3>CPU Usage</h3>
            <p>{deviceInfo?.cpuModel || "Unknown CPU"}</p>
          </div>
          <div className="chart-content">
            <Chart selectedView="CPU" data={cpuUsages} maxDataPoints={10} />
          </div>
        </div>

        <div className="chart-item">
          <div className="chart-header">
            <h3>RAM Usage</h3>
            <p>
              {deviceInfo?.total
                ? `${deviceInfo.total} GB Total`
                : "Unknown RAM"}
            </p>
          </div>
          <div className="chart-content">
            <Chart selectedView="RAM" data={ramUsages} maxDataPoints={10} />
          </div>
        </div>

        <div className="chart-item">
          <div className="chart-header">
            <h3>Storage Usage</h3>
            <p>Disk Space</p>
          </div>
          <div className="chart-content">
            <Chart
              selectedView="STORAGE"
              data={storageUsages}
              maxDataPoints={10}
            />
          </div>
        </div>

        <div className="chart-item">
          <div className="chart-header">
            <h3>System Overview</h3>
            <p>Combined Metrics</p>
          </div>
          <div className="chart-content">
            <Chart
              selectedView={activeView}
              data={activeUsages}
              maxDataPoints={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function useStaticData() {
  const [deviceInfo, setStaticData] = useState<deviceInfo | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticInfo());
    })();
  }, []);

  return deviceInfo;
}

export default App;
