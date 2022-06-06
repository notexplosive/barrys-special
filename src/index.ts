import * as PIXI from "pixi.js";
import { Game } from "./limbo/data/game";
import { preload } from "./mygame/preload"
import { main } from "./mygame/main"
import { finishLoad } from './limbo/core/assets';

// Setup DOM
document.body.style.margin = "0";
document.body.tabIndex = 1;
document.body.style.background = "rgb(0, 0, 50)";

// Setup App
let app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x111111,
});

var isDevBuild = false;
if (process.env.NODE_ENV !== "production") {
  console.log("💻🤖 DEVELOPMENT BUILD DETECTED 🤖💻");
}

document.body.appendChild(app.view);

export const game = new Game(app, { width: app.screen.width, height: app.screen.height }, isDevBuild);
app.ticker.add((dt) => game.update(dt));

preload()
finishLoad(main)