import { game } from "../index";
import { Container, Point, Sprite, Texture } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from './data/ingredient';
import { ButtonRow } from "./ui/button";

export let prop_hand: Sprite;
export let prop_mixer: Sprite;
export let updateables: IUpdateable[] = [];

export interface IUpdateable {
    update(dt: number): void;
}

export function main() {
    game.setupKey("ArrowUp")

    let bar = new Sprite(Assets.texture("background"));
    bar.zIndex = -20
    game.world.addChild(bar)

    let origin = new Point(game.world.screenWidth / 2, game.world.screenHeight / 2)

    prop_mixer = new Sprite(Assets.spritesheet("glass").textures[1]);
    prop_mixer.x = origin.x
    prop_mixer.y = origin.y + 10
    prop_mixer.anchor.set(0.5, 0.5)
    game.world.addChild(prop_mixer)

    prop_hand = new Sprite(Assets.spritesheet("glass").textures[0]);
    prop_hand.x = origin.x;
    prop_hand.y = 160
    prop_hand.anchor.set(0.5, 0.5)
    game.world.addChild(prop_hand)
    game.world.setZoom(1.5, true)

    let isDoneDropping = animate_dropIngredients(Ingredient.All[0])


    let buttonRow = new ButtonRow();
    buttonRow.y = 464
    game.rootContainer.addChild(buttonRow)

    for (let ingredient of Ingredient.All) {
        buttonRow.addIngredientButton(ingredient)
    }

    game.updaters.push(new Updater((dt) => {
        let snapshot = updateables.concat([])
        for (let updatable of snapshot) {
            updatable.update(dt)
        }
    }))
}
