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
import { Patron } from "./data/patron";
import { Dialogue } from "./data/dialogue";
import { Taste } from "./data/taste";
import { Flavor } from "./data/flavor";

export let prop_hand: Hand;
export let prop_mixer: Mixer;
export let prop_patron: PatronHolder;
export let updateables: IUpdateable[] = [];
export let camera: Camera;
export const currentMixture = new Mixture(3)
export let allPatrons: Patron[]

export interface IUpdateable {
    update(dt: number): void;
}

export function main() {
    allPatrons = [
        new Patron(
            "Beep",
            new Taste()
                .addLike(Flavor.Oily).addLike(Flavor.Bitter).addLike(Flavor.Salty)
                .addHate(Flavor.Sweet).addHate(Flavor.Mushy),
            new Dialogue(),
            new PatronSprite(0.25, Assets.spritesheet("beep"))
        ),

        new Patron(
            "Zap",
            new Taste()
                .addLike(Flavor.Majickal).addLike(Flavor.Crisp).addLike(Flavor.Funny)
                .addHate(Flavor.Dizzy),
            new Dialogue(),
            new PatronSprite(0.3, Assets.spritesheet("zap"))
        ),

        new Patron(
            "Skrbaogrk",
            new Taste()
                .addLike(Flavor.Funny)
                .addLike(Flavor.Crisp)
                .addLike(Flavor.Sweet)
                .addLike(Flavor.Earthy)
                .addLike(Flavor.Majickal)
                .addLike(Flavor.Salty)
                .addLike(Flavor.Oily)
                .addLike(Flavor.Dizzy)
                .addLike(Flavor.Toxic)
                .addLike(Flavor.Bitter)
                .addLike(Flavor.Gross)
            ,
            new Dialogue(),
            new PatronSprite(0.5, Assets.spritesheet("creature"))
        ),

        new Patron(
            "Psycho-X",
            new Taste()
                .addLike(Flavor.Toxic)
                .addHate(Flavor.Oily),
            new Dialogue(),
            new PatronSprite(0.4, Assets.spritesheet("psycho-x"))
        ),

        new Patron(
            "Uncle Jim",
            new Taste()
                .addLike(Flavor.Funny).addLike(Flavor.Energizing).addLike(Flavor.Bitter)
                .addHate(Flavor.Mushy).addHate(Flavor.Sweet).addHate(Flavor.Hairy),
            new Dialogue(),
            new PatronSprite(0.3, Assets.spritesheet("jim"))
        ),

        new Patron(
            "Mr. W",
            new Taste()
                .addLike(Flavor.Salty).addLike(Flavor.Sweet).addLike(Flavor.Oily)
                .addHate(Flavor.Toxic).addHate(Flavor.Dizzy),
            new Dialogue(),
            new PatronSprite(0.4, Assets.spritesheet("mrw"))
        ),

        new Patron(
            "Donny",
            new Taste()
                .addLike(Flavor.Gross).addLike(Flavor.Oily).addLike(Flavor.Funny)
                .addHate(Flavor.Sweet).addHate(Flavor.Mushy).addHate(Flavor.Hairy),
            new Dialogue(),
            new PatronSprite(0.4, Assets.spritesheet("donny"))
        ),
    ]

    // debugging tool to make it easy to see what ingredients work and don't work
    if (game.isDevBuild) {
        let enjoyedIngredients: Ingredient[] = []

        for (let patron of allPatrons) {
            if (patron.name == "Skrbaogrk") {
                continue
            }

            console.log(patron.name, patron.taste.getLikesNames())

            let allTheGoodStuff = new Mixture(100)

            for (let ingredient of Ingredient.All) {
                let reaction = patron.taste.getReactionToProfile(ingredient.flavorProfile)
                let willEat = reaction.dislikedFlavorCount() == 0
                let willEnjoy = reaction.likedFlavorCount() > 0 && willEat
                let tooGood = reaction.likedFlavorCount() > 1 && willEnjoy

                if (willEnjoy) {
                    allTheGoodStuff.addIngredient(ingredient)
                    enjoyedIngredients.push(ingredient)
                }

                console.log(
                    "\t", willEat ? (willEnjoy ? "✅" : "➖") : "❌",
                    ingredient.name,
                    willEat ? "" : `(${reaction.dislikedFlavorNames().join(", ")})`,
                    tooGood ? "❓" : "",
                    willEnjoy ? `(${reaction.likedFlavorNames().join(', ')})` : ""
                )
            }

            let reactionToEverything = patron.taste.getReactionToProfile(allTheGoodStuff.flavorProfile())
            if (reactionToEverything.missingFlavorCount() > 0) {
                console.log(`🟡🟡🟡 No source of ${reactionToEverything.missingFlavorNames().join(", ")}`)
            }
        }

        for (let ingredient of Ingredient.All) {
            if (!enjoyedIngredients.includes(ingredient)) {
                console.log("🟠🟠🟠", ingredient.name, "Is not enjoyed by anyone")
            }
        }
    }

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
    prop_patron = new PatronHolder(new Point(origin.x - 20, origin.y))
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
    mixtureStatus.y = origin.y
    mainGameUi.addChild(mixtureStatus);

    currentMixture.whenChanged(() => mixtureStatus.refresh())

    const tooltip = new Tooltip()
    tooltip.position.set(origin.x, origin.y + 90)
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
        tooltip.setText("Ready to Mix!", (currentMixture.flavorProfile().allNonZeroFlavors().map((flavor) => flavor.name)).join(", "))
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
    private glassLiquid: Sprite;
    tweenableRotation: TweenableNumber;

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

        const glassFill_1 = new Sprite(Assets.spritesheet("glass").textures[5]);
        glassFill_1.anchor.set(0.5, 0.5)
        glassFill_1.zIndex = 20
        glassFill_1.alpha = 0.35
        glassFill_1.tint = 0xaaaaff
        this.glassPart.addChild(glassFill_1)

        const glassFill_2 = new Sprite(Assets.spritesheet("glass").textures[6]);
        glassFill_2.anchor.set(0.5, 0.5)
        glassFill_2.zIndex = 15
        glassFill_2.alpha = 0.35
        glassFill_2.tint = 0xaaaaff
        this.glassPart.addChild(glassFill_2)

        this.glassLiquid = new Sprite(Assets.spritesheet("glass").textures[7]);
        this.glassLiquid.anchor.set(0.5, 0.5)
        this.glassLiquid.zIndex = 17
        this.glassLiquid.tint = 0xffffff
        this.glassPart.addChild(this.glassLiquid)

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
        this.tweenableRotation = new TweenableNumber(() => this.rotation, v => this.rotation = v)
        this.lidTweenableY = new TweenableNumber(() => this.lid.y, (val) => this.lid.y = val)
    }

    becomeGlass(mixture: Mixture) {
        this.lid.visible = false
        this.glassPart.visible = true
        this.glassLiquid.visible = true

        this.mixerForeground.visible = false
        this.mixerBackground.visible = false

        this.setLiquidColor(mixture.color())
    }

    becomeMixer() {
        this.glassPart.visible = false
        this.mixerForeground.visible = true
        this.mixerBackground.visible = true
    }

    setLiquidColor(color: number) {
        this.glassLiquid.tint = color
    }

    drink() {
        this.glassLiquid.visible = false
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
    private patron: Patron;
    readonly restingPosition: Point;
    readonly entrancePosition: Point;
    readonly exitPosition: Point;
    readonly tweenablePosition: TweenablePoint;
    readonly tweenableRotation: TweenableNumber;
    patronIndex: number;

    constructor(restingPosition: Point) {
        super();
        this.patronIndex = 0
        this.setPatron(allPatrons[this.patronIndex])
        this.position = restingPosition
        this.entrancePosition = new Point(restingPosition.x - 1000, restingPosition.y)
        this.exitPosition = new Point(restingPosition.x + 1000, restingPosition.y)
        this.tweenablePosition = new TweenablePoint(() => this.position, v => this.position = v)

        // rotation rotates the internal patronsprite and not the holder
        this.tweenableRotation = new TweenableNumber(() => this.patron.patronSprite.rotation, v => this.patron.patronSprite.rotation = v)
        this.restingPosition = restingPosition
    }

    setPatron(patron: Patron) {
        if (this.patron !== undefined) {
            this.removeChild(this.patron.patronSprite)
        }
        this.patron = patron
        this.addChild(patron.patronSprite)
    }

    getPatron() {
        return this.patron
    }

    rotatePatron() {
        this.patronIndex++;
        this.patronIndex %= allPatrons.length
        this.setPatron(allPatrons[this.patronIndex])
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