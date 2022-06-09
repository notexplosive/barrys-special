import { game } from "../index";
import { Container, Point, Sprite, Texture, Text, TextStyle, Rectangle, TextureLoader } from 'pixi.js';
import { Assets } from '../limbo/core/assets';
import { animate_dropIngredients, animate_mixAndServe, animate_putOnLid, animate_removeLid as animate_resetMixer, animationTween, animate_patronEnters } from './animations';
import { Updater } from "../limbo/data/updater";
import { Ingredient } from './data/ingredient';
import { IngredientButtons, Button, IconButton } from './ui/button';
import { Tooltip } from "./ui/tooltip";
import { PrimitiveRenderer } from '../limbo/render/primitive';
import { Mixture } from "./data/mixture";
import { MixtureStatus } from "./ui/mixture-status";
import { IsDoneFunction, Tweenable, TweenChain, TweenablePoint, EaseFunctions, WaitSecondsTween, CallbackTween, TweenableNumber } from './data/tween';
import { PatronSprite } from "./ui/patron-sprite";

export let prop_hand: Hand;
export let prop_mixer: Mixer;
export let prop_patron: PatronHolder;
export let updateables: IUpdateable[] = [];
export let camera: Camera;
export const currentMixture = new Mixture()

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
    let origin = new Point(game.world.screenWidth / 2, game.world.screenHeight / 2)


    let background = new Container()
    let solidColorBg = new Sprite(Assets.texture("solid-color-bg"));
    let bar = new Sprite(Assets.texture("background"));
    prop_patron = new PatronHolder(origin)
    let beep = new PatronSprite(0.25, Assets.spritesheet("beep"))
    prop_patron.setPatron(beep)
    background.addChild(solidColorBg)
    background.addChild(prop_patron)
    background.addChild(bar)

    background.zIndex = -20
    game.world.addChild(background)

    prop_mixer = new Mixer(new Point(origin.x, origin.y + 10))
    game.world.addChild(prop_mixer)

    prop_hand = new Hand();
    prop_hand.anchor.set(0.5, 0.5)
    game.world.addChild(prop_hand)
    game.world.setZoom(1.5, true)
    camera = new Camera(game.world.position.clone())

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

    animate_patronEnters()
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

export class Hand extends Sprite {
    readonly tweenablePosition: TweenablePoint;
    readonly restingPosition: Point = new Point(100, 600)
    readonly activePosition: Point = new Point(200, 250)

    constructor() {
        super(Assets.spritesheet("glass").textures[0])
        this.position = this.restingPosition
        this.tweenablePosition = new TweenablePoint(() => this.position, v => this.position = v)
    }
}

export class PatronHolder extends Container {
    private patron: PatronSprite;
    readonly restingPosition: Point;
    readonly entrancePosition: Point;
    readonly exitPosition: Point;
    readonly tweenablePosition: TweenablePoint;
    readonly tweenableRotation: TweenableNumber;

    constructor(restingPosition: Point) {
        super();
        this.position = restingPosition
        this.entrancePosition = new Point(restingPosition.x - 1000, restingPosition.y)
        this.exitPosition = new Point(restingPosition.x + 1000, restingPosition.y)
        this.tweenablePosition = new TweenablePoint(() => this.position, v => this.position = v)

        // rotation rotates the internal patronsprite and not the holder
        this.tweenableRotation = new TweenableNumber(() => this.patron.rotation, v => this.patron.rotation = v)
        this.restingPosition = restingPosition
    }

    setPatron(patron: PatronSprite) {
        if (this.patron !== undefined) {
            this.removeChild(this.patron)
        }
        this.patron = patron
        this.addChild(patron)
    }
}

export class Camera {
    readonly tweenablePosition = new TweenablePoint(() => game.world.position, v => game.world.position = v)
    readonly restingPosition: Point;
    readonly downPosition: Point;
    readonly upPosition: Point;

    constructor(restingPosition: Point) {
        this.restingPosition = restingPosition
        this.downPosition = addPoints(this.restingPosition, new Point(0, -100))
        this.upPosition = addPoints(this.restingPosition, new Point(0, 100))
    }
}

export function addPoints(left: Point, right: Point) {
    return new Point(left.x + right.x, left.y + right.y)
}