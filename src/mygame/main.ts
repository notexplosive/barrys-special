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
import { DialogueBox } from "./ui/dialogue-box";
import { Reaction } from "./data/reaction";

export let prop_hand: Hand;
export let prop_mixer: Mixer;
export let prop_patron: PatronHolder;
export let prop_gift: Gift;
export let updateables: IUpdateable[] = [];
export let camera: Camera;
export const currentMixture = new Mixture(3)
export let allPatrons: Patron[]
export let dialogueBox: DialogueBox

let ingredientButtons: IngredientButtons

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
            new Dialogue(
                ["Hey Barry!", "Zap and I are out looking for Giant Robot Parts.", "I figured I'd make a quick stop to see what the special is."],
                ["I'm back!", "No Giant Robot Parts today but it was still a pretty fun day."],
                ["Woah!!", "This amazing!", "I love it!!", "...", "Oh! I just remembered...", "We stole this from Psycho-X's lab.", "Can you hold onto it for safe keeping?", "My ride's here, gotta go, bye!"],
                ["Tastes like...", "Nothing??", "I think I don't have the right taste modules for this."],
                (reaction) => {
                    return [`That's pretty good! I like that it's ${reaction.likedFlavorNames().join(" and ")}.`, "I think it's missing something...", `Maybe add something ${reaction.missingFlavorNames()[0]}?`]
                },
                (reaction) => {
                    return ["Thanks I hate it!!!", `I hate ${reaction.dislikedFlavorNames()[0]} things, they mess up my circuits.`]
                }
            ),
            new PatronSprite(0.25, Assets.spritesheet("beep")),
            3 // Chemical B
        ),

        new Patron(
            "Zap",
            new Taste()
                .addLike(Flavor.Majickal).addLike(Flavor.Crisp).addLike(Flavor.Funny)
                .addHate(Flavor.Dizzy),
            new Dialogue(
                ["I'm following Beep around, as usual.", "I'll have the special, preferably something that restore Majick."],
                ["My mana is low...", "I could really use something to replenish my Majicks."],
                ["Ahh... fully restored!", "Thanks Barry! You're the best!"],
                ["That potion is... a dud."],
                (reaction) => {
                    return [`Hmm... It tastes ${reaction.likedFlavorNames().join(" and ")}, which I like.`, `Needs more... ${reaction.missingFlavorNames()[0]}...`]
                },
                (reaction) => {
                    return ["Nnggnhnhh", `The ${reaction.dislikedFlavorNames()[0]} flavor isn't sitting well with me.`, "Gotta go..."]
                }
            ),
            new PatronSprite(0.3, Assets.spritesheet("zap")),
            null
        ),

        new Patron(
            "Skrbaogrk",
            new Taste().enableEatsAnything()
            ,
            new Dialogue(
                ["(A horrifying creature approaches the bar)", "(You're not sure what it wants)", "(Your feel a cold sweat)", "(You look down to the bar and start preparing a drink)"],
                ["(It's back, and so is that metallic taste in your mouth)"],
                ["(It... seems satisfied?)", "(It left something on the table)", "(Is it an offering?)"],
                ["(It didn't seem to care for that.)"],
                (reaction) => {
                    return ["(It looks unsatisfied)"]
                },
                (reaction) => {
                    return ["(It didn't seem to like that)"]
                }
            ),
            new PatronSprite(0.5, Assets.spritesheet("creature")),
            8 // motor oil
        ),

        new Patron(
            "Psycho-X",
            new Taste()
                .addLike(Flavor.Toxic)
                .addHate(Flavor.Oily),
            new Dialogue(
                ["Good evening...", "I'm trying to craft the perfect poison...", "Think you can help me out?"],
                ["Mmyes... I have returned.", "Maybe you've found something sufficiently...", "Mmmm-deadly?"],
                ["Mmmmhmm... yes... This will do nicely.", "Meheheheheehhehhh", "Take this as a reward", "I found it in Uncle Jim's secret garden."],
                ["Is this a saline solution?", "I taste nothing!"],
                (reaction) => {
                    return ["Intriguing...", `I'm looking for something more...`, `${reaction.missingFlavorNames()[0]}...`]
                },
                (reaction) => {
                    return ["Agh!", "I almost enjoyed that. It's terrible!", `Did I taste ${reaction.dislikedFlavorNames()[0]}?!`, "That's all wrong!"]
                }
            ),
            new PatronSprite(0.4, Assets.spritesheet("psycho-x")),
            9 // funny herb
        ),

        new Patron(
            "Uncle Jim",
            new Taste()
                .addLike(Flavor.Funny).addLike(Flavor.Energizing).addLike(Flavor.Bitter)
                .addHate(Flavor.Mushy).addHate(Flavor.Sweet).addHate(Flavor.Hairy),
            new Dialogue(
                ["Hey there nephew.", "It's me, you're Uncle Jim!", "I'll take whatever you got."],
                ["How's my favorite nephew?", "I'm looking for a little pick-me-up."],
                ["Woahh! That's good stuff!", "Here, my new girlfriend gave me this and uh... I don't want it."],
                ["Huh...", "I didn't particularly like or dislike any of that."],
                (reaction) => {
                    return [`Ooh, not as ${reaction.missingFlavorNames()[0]} as I'd like...`, `But the ${reaction.likedFlavorNames().join(" and ")} ${reaction.likedFlavorNames().length > 1 ? "are" : "is"} spot on!`]
                },
                (reaction) => {
                    return ["(cough)", `I don't like ${reaction.dislikedFlavorNames()[0]} things.`, "Maybe you forgot, that's alright.", "I'm sure I'm not your only Uncle."]
                }
            ),
            new PatronSprite(0.3, Assets.spritesheet("jim")),
            4
        ),

        new Patron(
            "Mr. W",
            new Taste()
                .addLike(Flavor.Salty).addLike(Flavor.Sweet).addLike(Flavor.Oily)
                .addHate(Flavor.Toxic).addHate(Flavor.Dizzy),
            new Dialogue(
                ["(A very normal looking person approaches the bar)", "(He nods at you expectently)"],
                ["(The very normal looking person nods at you)"],
                ["(The very normal looking person looks pleased)", "(His torso sneezes onto the bar)", "(You collect the offering)"],
                ["(He doesn't seem impressed)"],
                (reaction) => {
                    return ["(He looks perplexed)", `(Looks like he enjoyed the ${reaction.likedFlavorNames().join(" and ")} taste)`, `(... but he wanted something ${reaction.missingFlavorNames()[0]} too)`]
                },
                (reaction) => {
                    return [`(He looks upset.)`, `(You assume he doesn't like ${reaction.dislikedFlavorNames()[0]})`]
                }
            ),
            new PatronSprite(0.4, Assets.spritesheet("mrw")),
            6
        ),

        new Patron(
            "Donny",
            new Taste()
                .addLike(Flavor.Gross).addLike(Flavor.Oily).addLike(Flavor.Funny)
                .addHate(Flavor.Sweet).addHate(Flavor.Mushy).addHate(Flavor.Hairy),
            new Dialogue(
                ["Hhhhey there.", "Look... there's no easy way to put this.", "Uhh..", "This is a robbery!", "Gimme all your cash!", "Oh you don't have any cash?", "Just drinks?", "Well uh... gimme a drink!"],
                ["Stick 'em up this is a--", "Oh wait I remember you."],
                ["Look...", "This is without a doubt.", "The worst robbery I've ever taken part in.", "But that last drink was pretty tasty", "So I'm gonna share something with you.", "It's my illegal dragon tooth collection.", "If anyone asks you, you didn't get them from me.", "Anyway, gotta run!"],
                ["Eh... kinda bland."],
                (reaction) => {
                    return [`Oo! It's got ${reaction.likedFlavorNames().join(" and ")}. That's good!`, `Got anything ${reaction.missingFlavorNames()[0]}?`, "That's what this needs!"]
                },
                (reaction) => {
                    return ["Yuck!", `Why would I want to drink something ${reaction.dislikedFlavorNames()[0]}?`, "Gotta run!"]
                }
            ),
            new PatronSprite(0.4, Assets.spritesheet("donny")),
            2
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

        for (let patron of allPatrons) {
            console.log(patron.name)
            console.log(
                "\n[[ Intro ]]\n", patron.dialogue.introPage.join("\n"),
                "\n[[ Bland ]]\n", patron.dialogue.bland.join("\n"),
                "\n[[ Return ]]\n", patron.dialogue.returnPage.join("\n"),
                "\n[[ Like ]]\n", patron.dialogue.like.join("\n"),
                "\n[[ Missing something (has 1 good thing) ]]\n", patron.dialogue.missingSomething(new Reaction([Flavor.Bitter], [], [Flavor.Energizing, Flavor.Crisp])).join("\n"),
                "\n[[ Missing something (has 2 good thing) ]]\n", patron.dialogue.missingSomething(new Reaction([Flavor.Bitter, Flavor.Funny], [], [Flavor.Energizing, Flavor.Crisp])).join("\n"),
                "\n[[ Dislike ]]\n", patron.dialogue.dislike(new Reaction([], [Flavor.Toxic, Flavor.Gross], [])).join("\n"),
            )
        }

        for (let patron of allPatrons) {
            if (patron.hasGift) {
                console.log(patron.name, "gifts", Ingredient.All[patron.giftIndex].name)
            } else {
                console.log(patron.name, "does not give a gift")
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

    prop_gift = new Gift(addPoints(origin, new Point(0, 50)))
    game.world.addChild(prop_gift)

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

    dialogueBox = new DialogueBox()
    dialogueBox.position.set(origin.x, 400)
    game.rootContainer.addChild(dialogueBox)

    updateables.push(dialogueBox)

    ingredientButtons = new IngredientButtons(tooltip, currentMixture);
    ingredientButtons.y = 464
    mainGameUi.addChild(ingredientButtons)

    addIngredientToInventory(Ingredient.All[0])
    addIngredientToInventory(Ingredient.All[1])
    addIngredientToInventory(Ingredient.All[5])
    addIngredientToInventory(Ingredient.All[6])

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

    rotatePatron(): boolean {
        this.patronIndex++;
        this.patronIndex %= allPatrons.length

        // Skip over patrons that have already enjoyed their drink
        if (allPatrons[this.patronIndex].hasEnjoyedDrink) {
            let isGameOver = true
            for (let patron of allPatrons) {
                if (!patron.hasEnjoyedDrink) {
                    isGameOver = false
                }
            }

            if (isGameOver) {
                return true
            }

            return this.rotatePatron()
        }

        this.setPatron(allPatrons[this.patronIndex])
        return false
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

export class Gift extends Sprite {
    readonly tweenablePosition: TweenablePoint
    readonly deployedPosition: Point;

    constructor(deployedPosition: Point) {
        super(null)
        this.anchor.set(0.5, 0.5)
        this.tweenablePosition = new TweenablePoint(() => this.position, v => this.position = v)
        this.deployedPosition = deployedPosition
    }

    appear(texture: Texture) {
        this.texture = texture
        this.visible = true
        this.position = addPoints(prop_patron.position.clone(), new Point(0, -100))
    }

    vanish() {
        this.visible = false
    }
}

export function addPoints(left: Point, right: Point) {
    return new Point(left.x + right.x, left.y + right.y)
}

export function addIngredientToInventory(ingredient: Ingredient) {
    ingredientButtons.addIngredientButton(ingredient)
}
