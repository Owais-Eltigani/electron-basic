import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";

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
    mainWindow.webContents.send("statistics", {
      deviceInfo,
      ramMatrix,
      cpuMatrix,
      diskMatrix,
    });
  }, POLLING_RATE);
};

const getStaticInfo = () => {
  const { total } = diskUsage();
  const cpuModel = os.cpus()[0].model;
  const clockSpeed = os.cpus()[0].speed;

  return {
    total,
    cpuModel,
    clockSpeed,
  };
};

const getCPUsage = () => {
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

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
};
// const getCPUsage =()=>{
//     return new Promise(resolve => {
//         osUtils.cpuUsage(resolve)
//     })
// }
