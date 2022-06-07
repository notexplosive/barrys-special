import { game } from "../index";
import { Container, Point, Sprite, Texture } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from "./data/ingredient";


export function main() {
    game.setupKey("ArrowUp")

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

    let isDoneDropping = animate_dropIngredients(hand, mixer, Ingredient.All[0])


    let buttonParent = new ButtonRow();
    buttonParent.y = 464
    game.rootContainer.addChild(buttonParent)

    buttonParent.addIngredientButton(() => { animate_dropIngredients(hand, mixer, Ingredient.All[0]) })
    buttonParent.addIngredientButton(() => { })
    buttonParent.addIngredientButton(() => { })
    buttonParent.addIngredientButton(() => { })
    buttonParent.addIngredientButton(() => { })
}

export class Button extends Container {
    readonly idleButtonTexture: Texture;
    readonly hoverButtonTexture: Texture;
    readonly pressedButtonTexture: Texture;

    constructor(parentRow: Container, onClicked: Function) {
        super()
        const buttonCount = parentRow.children.length
        parentRow.addChild(this)
        this.idleButtonTexture = Assets.spritesheet("buttons").textures[0];
        this.hoverButtonTexture = Assets.spritesheet("buttons").textures[1];
        this.pressedButtonTexture = Assets.spritesheet("buttons").textures[2];

        let buttonBackgroundSprite = new Sprite(this.idleButtonTexture)
        let buttonImageSprite = new Sprite(Assets.spritesheet("ingredients").textures[0])
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

        buttonBackgroundSprite.x = buttonCount * (ButtonRow.buttonWidth + ButtonRow.padding);
    }
}

export class ButtonRow extends Container {
    static readonly buttonWidth = 128;
    static readonly padding = 10
    addIngredientButton(onClicked: Function) {
        let button = new Button(this, onClicked);
    }

}