import { game } from "../index";
import { Point, Sprite } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";


export function main() {
    game.setupKey("ArrowUp")

    game.rootContainer.addChild(game.world)

    let bar = new Sprite(Assets.texture("background"));
    bar.zIndex = -20
    game.world.addChild(bar)

    let origin = new Point(game.world.screenWidth / 2, game.world.screenHeight / 2)

    let mixer = new Sprite(Assets.spritesheet("glass").textures[1]);
    mixer.x = origin.x
    mixer.y = origin.y + 10
    mixer.anchor.set(0.5, 0.5)
    game.world.addChild(mixer)

    let hand = new Sprite(Assets.spritesheet("glass").textures[0]);
    hand.x = origin.x;
    hand.y = 160
    hand.anchor.set(0.5, 0.5)
    game.world.addChild(hand)

    game.world.setZoom(1.5, true)

    let isDoneDropping = animate_dropIngredients(hand, mixer)
}
