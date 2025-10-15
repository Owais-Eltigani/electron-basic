import { BrowserWindow, app } from "electron"
import path from "path"
import { isDev } from "./util.js"
import { pollingResources } from "./resourceManager.js"


// run when the app is ready
app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({})

    // determine where is exe of the file in computer.
  
  if (!isDev) {
    //? dev mode.
    mainWindow.loadFile("http://localhost:5123")
  } else {
    //? production code.
      mainWindow.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'))
    }

pollingResources()
  })