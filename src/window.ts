import { BrowserWindow } from "electron";

const defaultProps = {
  width: 800,
  height: 800,
  show: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
  },
};

class Window extends BrowserWindow {
  constructor(
    file: string,
    windowSettings?: Electron.BrowserWindowConstructorOptions
  ) {
    super({ ...defaultProps, ...windowSettings }); //  must be a objet cause browser construct is a object
    this.loadFile(file);
    this.once("ready-to-show", this.show);
  }
}

export default Window;
