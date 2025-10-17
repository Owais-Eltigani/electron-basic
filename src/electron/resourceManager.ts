import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentSend } from "./util.js";

//
const POLLING_RATE = 500;

//? add the main window here as listener
export const pollingResources = (mainWindow: BrowserWindow) => {
  // pull resources every 500 sec.

  const deviceInfo = getStaticInfo();
  setInterval(async () => {
    console.log("pulling machine matrices ... \n");

    //
    const ramMatrix = ramUsage();
    const cpuMatrix = await getCPUsage();
    const diskMatrix = diskUsage();

    console.log({ deviceInfo, ramMatrix, cpuMatrix, diskMatrix });

    //? data sent to frontend.
    ipcWebContentSend(
      "statistics",
      {
        storageUsage: diskMatrix,
        cpuUsage: cpuMatrix,
        ramUsage: ramMatrix,
      },
      mainWindow.webContents
    );
  }, POLLING_RATE);
};

export const getStaticInfo = () => {
  const total = diskUsage();
  const cpuModel = os.cpus()[0].model;
  const clockSpeed = os.cpus()[0].speed;

  console.log({
    total,
    cpuModel,
    clockSpeed,
  });

  return {
    total,
    cpuModel,
    clockSpeed,
  };
};

const getCPUsage = (): Promise<number> => {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
};

const ramUsage = () => {
  return 1 - osUtils.freememPercentage();
};

const diskUsage = () => {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return Math.floor(total / 1_000_000_000);
  //   return {
  //     total: Math.floor(total / 1_000_000_000),
  //     usage: 1 - free / total,
  //   };
};
// const getCPUsage =()=>{
//     return new Promise(resolve => {
//         osUtils.cpuUsage(resolve)
//     })
// }
