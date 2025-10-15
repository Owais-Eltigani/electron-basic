import osUtils from "os-utils";
import fs, { stat } from "fs";

//
const POLLING_RATE = 500;
export const pollingResources = () => {
  // pull resources every 500 sec.
  setInterval(async () => {
    console.log("pulling machine matrices ... ");

    //
    const ramMatrix = ramUsage();
    const cpuMatrix = await getCPUsage();
    const diskMatrix = diskUsage();
    console.log({ ramMatrix, cpuMatrix, diskMatrix });
  }, POLLING_RATE);
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
