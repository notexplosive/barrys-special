import { game } from "../index";
import { Container, Point, Sprite, Texture } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from './data/ingredient';

export let prop_hand: Sprite;
export let prop_mixer: Sprite;

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


    let buttonParent = new ButtonRow();
    buttonParent.y = 464
    game.rootContainer.addChild(buttonParent)

    buttonParent.addIngredientButton(Ingredient.All[0])
    buttonParent.addIngredientButton(Ingredient.All[1])
    buttonParent.addIngredientButton(Ingredient.All[2])
    buttonParent.addIngredientButton(Ingredient.All[3])
    buttonParent.addIngredientButton(Ingredient.All[4])

}

export class Button extends Container {
    protected readonly idleButtonTexture: Texture;
    protected readonly hoverButtonTexture: Texture;
    protected readonly pressedButtonTexture: Texture;

    constructor(parentRow: Container, idleButtonTexture: Texture, hoverButtonTexture: Texture, pressedButtonTexture: Texture, buttonImageTexture: Texture, onClicked: Function) {
        super()
        this.idleButtonTexture = idleButtonTexture
        this.hoverButtonTexture = hoverButtonTexture
        this.pressedButtonTexture = pressedButtonTexture

        const buttonCount = parentRow.children.length
        parentRow.addChild(this)
        this.x = buttonCount * (ButtonRow.buttonWidth + ButtonRow.padding);

        let buttonBackgroundSprite = new Sprite(this.idleButtonTexture)
        let buttonImageSprite = new Sprite(buttonImageTexture);
        buttonBackgroundSprite.addChild(buttonImageSprite)
        this.addChild(buttonBackgroundSprite);

        buttonBackgroundSprite.interactive = true;
        buttonBackgroundSprite.buttonMode = true;

        let buttonState = { isEngaged: false, isHovered: false }

        function onButtonDown() {
            buttonState.isEngaged = true
        }

        function onButtonUp() {
            if (buttonState.isEngaged) {
                onClicked()
            }

            buttonState.isEngaged = false
        }

        function onButtonHover() {
            buttonState.isHovered = true
        }

        function onButtonUnhover() {
            buttonState.isHovered = false
        }

        function onButtonUpOutside() {
            buttonState.isEngaged = false
        }

        game.updaters.push(new Updater(() => {
            buttonImageSprite.y = 0
            buttonBackgroundSprite.texture = this.idleButtonTexture

            if (buttonState.isHovered) {
                buttonBackgroundSprite.texture = this.hoverButtonTexture
                buttonImageSprite.y = 2
            }

            if (buttonState.isEngaged) {
                buttonBackgroundSprite.texture = this.pressedButtonTexture
                buttonImageSprite.y = 5
            }
        }))

        buttonBackgroundSprite.on("pointerdown", onButtonDown)
        buttonBackgroundSprite.on("pointerup", onButtonUp)
        buttonBackgroundSprite.on("pointerover", onButtonHover)
        buttonBackgroundSprite.on("pointerout", onButtonUnhover)
        buttonBackgroundSprite.on("pointerupoutside", onButtonUpOutside)
    }
}

export class IngredientButton extends Button {
    constructor(parentRow: Container, ingredient: Ingredient) {
        super(
            parentRow,
            Assets.spritesheet("buttons").textures[0],
            Assets.spritesheet("buttons").textures[1],
            Assets.spritesheet("buttons").textures[2],
            ingredient.texture(),
            () => { animate_dropIngredients(ingredient) }
        )
    }
}

export class ButtonRow extends Container {
    static readonly buttonWidth = 128;
    static readonly padding = 10

    addIngredientButton(ingredient: Ingredient) {
        let button = new IngredientButton(this, ingredient);
    }

}