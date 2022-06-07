import { game } from "../index";
import { Container, Point, Sprite } from "pixi.js";
import { Assets } from '../limbo/core/assets';
import { Viewport } from "pixi-viewport"
import { Updater } from "../limbo/data/updater";

export function main() {
    game.setupKey("ArrowUp")

    game.rootContainer.addChild(game.world)

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


    let droppings = [
        createDropParticle(hand, mixer, 0),
        createDropParticle(hand, mixer, 1),
        createDropParticle(hand, mixer, 2),
        createDropParticle(hand, mixer, 3),
        createDropParticle(hand, mixer, 4),
        createDropParticle(hand, mixer, 5),
        createDropParticle(hand, mixer, 6),
        createDropParticle(hand, mixer, 7),
    ]

    let droppingUpdater = new Updater((dt) => {
        for (let dropping of droppings) {
            dropping.update(dt)
        }
    });

    game.updaters.push(droppingUpdater)

    game.world.setZoom(1.5, true)
}

function createDropParticle(hand: Container, mixer: Container, delay: number) {
    let droppingContainer = new Sprite(Assets.spritesheet("ingredients").textures[0]);
    droppingContainer.x = hand.x + (Math.random() - 0.5) * 40
    droppingContainer.y = hand.y + (Math.random() - 0.5) * 10
    droppingContainer.anchor.set(0.5, 0.5)
    droppingContainer.scale.set(0.25);
    droppingContainer.zIndex -= 1
    droppingContainer.rotation = Math.random() * Math.PI * 2
    game.world.addChild(droppingContainer)

    return new DropParticle(droppingContainer, hand.y, mixer.y, delay)
}

class DropParticle {
    readonly sprite: Sprite;
    readonly handY: number;
    readonly mixerY: number;
    private velocity: number;
    private delay: number;
    isDone: boolean;

    constructor(sprite: Sprite, handY: number, mixerY: number, delay: number) {
        this.sprite = sprite
        this.handY = handY;
        this.mixerY = mixerY;
        this.delay = delay * 2
        this.velocity = 0;
        this.isDone = false
    }

    update(dt: number) {
        if (this.delay > 0) {
            this.delay -= dt;
            return
        }

        if (this.isDone) {
            return
        }

        this.velocity += dt / 10
        this.sprite.y += dt * this.velocity;
        this.sprite.rotation += dt / 10
        if (this.sprite.y > this.mixerY) {
            this.isDone = true
        }
    }
}