import * as PIXI from 'pixi.js';
import { game } from "../index";
import { Sprite } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { Viewport } from "pixi-viewport"

export function main() {
    game.setupKey("ArrowUp")

    game.rootContainer.addChild(game.world)

    var background = new Sprite(Assets.texture("background"));
    game.world.addChild(background)

    var ingredient = new Sprite(Assets.spritesheet("ingredients").textures["ingredients-0"]);
    ingredient.x = 200
    ingredient.y = 300
    ingredient.scale.set(0.25);
    game.world.addChild(ingredient)

    var glass = new Sprite(Assets.spritesheet("glass").textures["0"]);
    glass.x = 200
    glass.y = 200
    game.world.addChild(glass)

    game.world.setZoom(2, true)
}