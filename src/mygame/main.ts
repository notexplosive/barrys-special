import { game } from "../index";
import { Container, Point, Sprite, Texture, Text, TextStyle, Rectangle } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from './data/ingredient';
import { IngredientButtons, Button, IconButton } from './ui/button';
import { Tooltip } from "./ui/tooltip";
import { PrimitiveRenderer } from '../limbo/render/primitive';
import { Mixture } from "./data/mixture";
import { MixtureStatus } from "./ui/mixture-status";

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

    // let isDoneDropping = animate_dropIngredients(Ingredient.All[0])

    let mainGameUi = game.rootContainer.addChild(new Container())

    const mixture = new Mixture()
    const mixtureStatus = new MixtureStatus(mixture)
    mixtureStatus.x = origin.x
    mixtureStatus.y = origin.y + 60
    mainGameUi.addChild(mixtureStatus);

    mixture.whenChanged(() => mixtureStatus.refresh())

    const tooltip = new Tooltip()
    tooltip.position.set(origin.x, origin.y + 120)
    mainGameUi.addChild(tooltip);

    let ingredientButtons = new IngredientButtons(tooltip, mixture);
    ingredientButtons.y = 464
    mainGameUi.addChild(ingredientButtons)

    for (let ingredient of Ingredient.All) {
        ingredientButtons.addIngredientButton(ingredient)
    }

    let serveButtons = mainGameUi.addChild(new Container())
    serveButtons.visible = false
    serveButtons.y = 464

    const mixButton = new IconButton(Assets.spritesheet("icons").textures[0], () => {
        serveButtons.visible = false
    });
    serveButtons.addChild(mixButton)

    const cancelButton = new IconButton(Assets.spritesheet("icons").textures[1], () => {
        serveButtons.visible = false
        ingredientButtons.visible = true
        mixture.clearIngredients()
    });
    cancelButton.x = 128 + 10
    serveButtons.addChild(cancelButton)

    mixture.whenChanged(() => {
        if (mixture.isFilled()) {
            ingredientButtons.visible = false
            tooltip.setText("Ready!")
            serveButtons.visible = true
        }
    })

    // update the updaters
    game.updaters.push(new Updater((dt) => {
        let snapshot = updateables.concat([]) // want to buy array.clone()
        for (let updatable of snapshot) {
            updatable.update(dt)
        }
    }))
}