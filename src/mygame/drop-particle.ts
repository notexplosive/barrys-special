import { Container, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Assets } from "../limbo/core/assets";
import { Ingredient } from './data/ingredient';

export function createDropParticle(hand: Container, mixer: Container, ingredient: Ingredient, delay: number) {
    let particleContainer = new Sprite(ingredient.texture());
    particleContainer.x = (hand.x - mixer.x) + (Math.random() - 0.5) * 40
    particleContainer.y = (hand.y - mixer.y) + (Math.random() - 0.5) * 10

    particleContainer.anchor.set(0.5, 0.5)
    particleContainer.scale.set(0.25);
    particleContainer.zIndex -= 1
    particleContainer.rotation = Math.random() * Math.PI * 2
    mixer.addChild(particleContainer)

    return new DropParticle(particleContainer, hand.y, mixer.y, delay)
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
        if (this.sprite.y > 0) {
            this.isDone = true
        }
    }

    destroy() {
        this.sprite.destroy()
    }
}