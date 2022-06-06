import * as PIXI from "pixi.js";
import { Game } from "./limbo/data/game";

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

// Setup Game
const localGame = new Game(app, isDevBuild);

app.ticker.add((dt) => localGame.update(dt));

export function game(): Game { return localGame; }