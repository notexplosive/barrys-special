import { game } from "../index";
import { Container, Point, Sprite, Texture, Text, TextStyle, Rectangle } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from './data/ingredient';
import { ButtonRow } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import { PrimitiveRenderer } from '../limbo/render/primitive';

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

    const tooltip = new Tooltip()
    tooltip.position.set(origin.x, origin.y + 120)
    mainGameUi.addChild(tooltip);

    let buttonRow = new ButtonRow(tooltip);
    buttonRow.y = 464
    mainGameUi.addChild(buttonRow)

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

export class Mixture {
    ingredients(): Ingredient[] {
        return [Ingredient.All[5], Ingredient.All[1], Ingredient.All[3]]
    }
}

export class MixtureStatus extends Container {
    public readonly mixture: Mixture;
    slots: Sprite[];

    constructor(mixture: Mixture) {
        super();
        this.mixture = mixture;
        this.sortableChildren = true

        function createSlot(): Sprite {
            const result = new Sprite()
            result.anchor.set(0.5)
            result.scale.set(0.5)
            result.zIndex += 10
            return result
        }

        this.slots = [createSlot(), createSlot(), createSlot()]
        this.addChild(this.slots[0])
        this.addChild(this.slots[1])
        this.addChild(this.slots[2])

        const spacing = 64
        this.slots[0].x = -spacing
        this.slots[2].x = spacing

        const renderer = new PrimitiveRenderer(this)
        renderer.rectangle(true, new Rectangle(-spacing - 32, -32, 64 * 3, 64), { color: 0xffffff, alpha: 0.5 })

        this.updateDisplay()
    }

    updateDisplay() {
        let ingredients = this.mixture.ingredients()
        for (let i = 0; i < ingredients.length; i++) {
            this.slots[i].texture = ingredients[i].texture()
        }
    }
}