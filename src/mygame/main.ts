import { game } from "../index";
import { Container, Point, Sprite, Texture, Text, TextStyle, Rectangle, TextureLoader } from 'pixi.js';
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients, animate_mixAndServe, animate_putOnLid, animate_removeLid as animate_resetMixer, animationTween } from './animations';
import { Updater } from "../limbo/data/updater";
import { Ingredient } from './data/ingredient';
import { IngredientButtons, Button, IconButton } from './ui/button';
import { Tooltip } from "./ui/tooltip";
import { PrimitiveRenderer } from '../limbo/render/primitive';
import { Mixture } from "./data/mixture";
import { MixtureStatus } from "./ui/mixture-status";
import { IsDoneFunction, Tweenable, TweenChain, TweenablePoint, EaseFunctions, WaitSecondsTween, CallbackTween, TweenableNumber } from './data/tween';

export let prop_hand: Hand;
export let prop_mixer: Mixer;
export let updateables: IUpdateable[] = [];
export const currentMixture = new Mixture()
export let cameraRestingPosition = new Point(0, 0)

export interface IUpdateable {
    update(dt: number): void;
}

export function main() {
    updateables.push({
        update: (dt) => {
            animationTween.update(dt)

            if (animationTween.isDone() && !animationTween.isEmpty()) {
                animationTween.clear()
            }

            mainGameUi.visible = animationTween.isDone() || animationTween.isEmpty()
        }
    })

    let bar = new Sprite(Assets.texture("background"));
    bar.zIndex = -20
    game.world.addChild(bar)

    let origin = new Point(game.world.screenWidth / 2, game.world.screenHeight / 2)

    prop_mixer = new Mixer(new Point(origin.x, origin.y + 10))
    game.world.addChild(prop_mixer)

    prop_hand = new Hand();
    prop_hand.anchor.set(0.5, 0.5)
    game.world.addChild(prop_hand)
    game.world.setZoom(1.5, true)
    cameraRestingPosition = game.world.position.clone()

    updateables.push(prop_hand)

    // let isDoneDropping = animate_dropIngredients(Ingredient.All[0])

    let mainGameUi = game.rootContainer.addChild(new Container())

    const mixtureStatus = new MixtureStatus(currentMixture)
    mixtureStatus.x = origin.x
    mixtureStatus.y = origin.y + 60
    mainGameUi.addChild(mixtureStatus);

    currentMixture.whenChanged(() => mixtureStatus.refresh())

    const tooltip = new Tooltip()
    tooltip.position.set(origin.x, origin.y + 120)
    mainGameUi.addChild(tooltip);

    let ingredientButtons = new IngredientButtons(tooltip, currentMixture);
    ingredientButtons.y = 464
    mainGameUi.addChild(ingredientButtons)

    for (let ingredient of Ingredient.All) {
        ingredientButtons.addIngredientButton(ingredient)
    }

    let serveButtons = mainGameUi.addChild(new Container())
    serveButtons.visible = false
    serveButtons.y = 464

    function resetToNormal_state() {
        serveButtons.visible = false
        ingredientButtons.visible = true
        currentMixture.clearIngredients()
    }

    const mixButton = new IconButton(Assets.spritesheet("icons").textures[0], () => {
        animate_mixAndServe()
        animationTween.add(new CallbackTween(() => {
            console.log("Resetting to normal state")
            resetToNormal_state()
        }))
    });
    serveButtons.addChild(mixButton)


    const cancelButton = new IconButton(Assets.spritesheet("icons").textures[1], () => {
        resetToNormal_state()
        animate_resetMixer()
    });
    cancelButton.x = 128 + 10
    serveButtons.addChild(cancelButton)

    function readyToServe_state() {
        ingredientButtons.visible = false
        tooltip.setText("Ready!")
        serveButtons.visible = true
    }

    currentMixture.whenChanged(() => {
        if (currentMixture.isFilled()) {
            readyToServe_state()
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


export class Mixer extends Container {
    readonly lid: Sprite;
    lidTweenableY: TweenableNumber;
    readonly tweenablePosition: TweenablePoint;
    restingPosition: Point
    mixerBackground: Sprite;
    mixerForeground: Sprite;
    glassPart: Container;

    constructor(restingPosition: Point) {
        super()
        this.restingPosition = restingPosition
        this.position = this.restingPosition
        this.sortableChildren = true

        this.mixerBackground = new Sprite(Assets.spritesheet("glass").textures[2])
        this.mixerBackground.anchor.set(0.5, 0.5)
        this.addChild(this.mixerBackground)
        this.mixerBackground.zIndex = -10

        this.mixerForeground = new Sprite(Assets.spritesheet("glass").textures[1]);
        this.mixerForeground.anchor.set(0.5, 0.5)
        this.mixerForeground.zIndex = 10
        this.addChild(this.mixerForeground)

        this.glassPart = new Container()
        this.glassPart.sortableChildren = true
        this.glassPart.visible = false
        this.addChild(this.glassPart)

        const glassForeground = new Sprite(Assets.spritesheet("glass").textures[4]);
        glassForeground.anchor.set(0.5, 0.5)
        glassForeground.zIndex = 10
        this.glassPart.addChild(glassForeground)

        let mixerLid = new Sprite(Assets.spritesheet("glass").textures[3]);
        mixerLid.anchor.set(0.5, 0.5)
        mixerLid.zIndex = 15

        this.lid = this.addChild(mixerLid)
        this.lid.visible = false

        this.tweenablePosition = new TweenablePoint(() => this.position, v => this.position = v)
        this.lidTweenableY = new TweenableNumber(() => this.lid.y, (val) => this.lid.y = val)
    }

    becomeGlass() {
        this.lid.visible = false
        this.glassPart.visible = true
        this.mixerForeground.visible = false
        this.mixerBackground.visible = false
    }

    becomeMixer() {
        this.glassPart.visible = false
        this.mixerForeground.visible = true
        this.mixerBackground.visible = true
    }
}

export class Hand extends Sprite implements IUpdateable {
    readonly tweenablePosition: TweenablePoint;
    readonly restingPosition: Point = new Point(100, 600)
    readonly activePosition: Point = new Point(200, 250)

    constructor() {
        super(Assets.spritesheet("glass").textures[0])
        this.position = this.restingPosition
        this.tweenablePosition = new TweenablePoint(() => this.position, v => this.position = v)
    }

    update(dt: number): void {
    }
}

