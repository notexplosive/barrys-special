import { game } from "../index";
import { Container, Point, Sprite } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients } from "./animations";
import { Updater } from "../limbo/data/updater";


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

    let isDoneDropping = animate_dropIngredients(hand, mixer, Assets.spritesheet("ingredients").textures[0])


    let buttonParent = new Container();
    buttonParent.y = 464
    game.rootContainer.addChild(buttonParent)

    addButtonToRow(buttonParent, () => { animate_dropIngredients(hand, mixer, Assets.spritesheet("ingredients").textures[0]) })
    addButtonToRow(buttonParent, () => { })
    addButtonToRow(buttonParent, () => { })
    addButtonToRow(buttonParent, () => { })
    addButtonToRow(buttonParent, () => { })
}

function addButtonToRow(buttonParent: Container, onClicked: Function) {
    const buttonWidth = 128;
    const buttonCount = buttonParent.children.length
    const padding = 10

    const idleButtonTexture = Assets.spritesheet("buttons").textures[0];
    const hoverButtonTexture = Assets.spritesheet("buttons").textures[1];
    const pressedButtonTexture = Assets.spritesheet("buttons").textures[2];

    let buttonBackgroundSprite = new Sprite(idleButtonTexture)
    let buttonImageSprite = new Sprite(Assets.spritesheet("ingredients").textures[0])
    buttonBackgroundSprite.addChild(buttonImageSprite)
    buttonParent.addChild(buttonBackgroundSprite)

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
        buttonBackgroundSprite.texture = idleButtonTexture

        if (buttonState.isHovered) {
            buttonBackgroundSprite.texture = hoverButtonTexture
            buttonImageSprite.y = 2
        }

        if (buttonState.isEngaged) {
            buttonBackgroundSprite.texture = pressedButtonTexture
            buttonImageSprite.y = 5
        }
    }))

    buttonBackgroundSprite.on("pointerdown", onButtonDown)
    buttonBackgroundSprite.on("pointerup", onButtonUp)
    buttonBackgroundSprite.on("pointerover", onButtonHover)
    buttonBackgroundSprite.on("pointerout", onButtonUnhover)
    buttonBackgroundSprite.on("pointerupoutside", onButtonUpOutside)

    buttonBackgroundSprite.x = buttonCount * (buttonWidth + padding);
}
