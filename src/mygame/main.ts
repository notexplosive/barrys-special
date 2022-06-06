import * as PIXI from 'pixi.js';
import { game } from "../index";
import { Sprite } from "pixi.js";
import { Assets } from '../limbo/core/assets';

export function main() {
    game.setupKey("ArrowUp")

    var background = new Sprite(Assets.texture("background"));
    game.worldContainer.addChild(background)

    console.log(Assets.spritesheet("ingredients"))
    var sprite = new Sprite(Assets.spritesheet("ingredients").textures["ingredients-0"]);
    game.worldContainer.addChild(sprite)
}