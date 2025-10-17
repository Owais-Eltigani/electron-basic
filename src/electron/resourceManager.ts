import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentSend } from "./util.js";

//
const POLLING_RATE = 500;

export const pollingResources = (mainWindow: BrowserWindow) => {
  // pull resources every 500 sec.

  setInterval(async () => {
    console.log("pulling machine matrices ... \n");

    //
    const ramUsage = getRamUsage();
    const cpuUsage = await getCPUsage();
    const storageUsage = diskUsage();

    console.log({ cpuUsage, ramUsage, storageUsage });

    //? data sent to frontend.
    ipcWebContentSend(
      "statistics",
      {
        cpuUsage,
        ramUsage,
        storageUsage,
      },
      mainWindow.webContents
    );
  }, POLLING_RATE);
};

export const deviceInfo = () => {
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

const getRamUsage = () => {
  return 1 - osUtils.freememPercentage();
};

const diskUsage = () => {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;

  return Math.floor(total / 1_000_000_000);
  //   return {
  //     total: Math.floor(total / 1_000_000_000),
  //     usage: 1 - free / total,
  //   };
};
