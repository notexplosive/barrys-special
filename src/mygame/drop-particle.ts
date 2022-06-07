import { Container, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Assets } from "../limbo/core/assets";

export function createDropParticle(hand: Container, mixer: Container, texture: Texture, delay: number) {
    let droppingContainer = new Sprite(texture);
    droppingContainer.x = hand.x + (Math.random() - 0.5) * 40
    droppingContainer.y = hand.y + (Math.random() - 0.5) * 10
    droppingContainer.anchor.set(0.5, 0.5)
    droppingContainer.scale.set(0.25);
    droppingContainer.zIndex -= 1
    droppingContainer.rotation = Math.random() * Math.PI * 2
    game.world.addChild(droppingContainer)

    return new DropParticle(droppingContainer, hand.y, mixer.y, delay)
}

export class DropParticle {
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
        this.velocity = 5;
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

    destroy() {
        this.sprite.destroy()
    }
}