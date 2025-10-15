import { BrowserWindow, app } from "electron"
import path from "path"


// run when the app is ready
app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({})

    // determine where is exe of the file in computer.
    mainWindow.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'))
})