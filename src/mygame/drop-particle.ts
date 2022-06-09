import { Container, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Assets } from "../limbo/core/assets";
import { Ingredient } from './data/ingredient';
import { TweenChain, TweenableNumber, MultiplexTween, CallbackTween, Tween, EaseFunction, EaseFunctions, WaitSecondsTween } from './data/tween';
import { updateables } from './main';

export function createDropParticle(hand: Container, mixer: Container, ingredient: Ingredient, index: number) {
    let particleContainer = new Sprite(ingredient.texture());
    particleContainer.x = (hand.x - mixer.x) + (Math.random() - 0.5) * 40
    particleContainer.y = (hand.y - mixer.y) + (Math.random() - 0.5) * 10

    particleContainer.anchor.set(0.5, 0.5)
    particleContainer.scale.set(0.25);
    particleContainer.zIndex -= 1
    particleContainer.rotation = Math.random() * Math.PI * 2
    mixer.addChild(particleContainer)

    return new DropParticle(particleContainer, hand.y, mixer.y, index / 50)
}

export class DropParticle {
    readonly sprite: Sprite;
    readonly handY: number;
    readonly mixerY: number;
    readonly tweenChain: TweenChain;
    isDestroyed: boolean;

    constructor(sprite: Sprite, handY: number, mixerY: number, delay: number) {
        this.sprite = sprite
        this.handY = handY;
        this.mixerY = mixerY;

        const tweenableX = new TweenableNumber(() => this.sprite.x, value => this.sprite.x = value)
        const tweenableY = new TweenableNumber(() => this.sprite.y, value => this.sprite.y = value)

        function noise(scale: number) {
            return (Math.random() - 0.5) * scale
        }

        this.tweenChain = new TweenChain()
            .add(new WaitSecondsTween(delay))
            .add(new MultiplexTween()
                .addChannel(new Tween<number>(tweenableX, 0 + noise(40), 0.25 + noise(0.1), EaseFunctions.linear)) // target x is 0 because our parent is the mixer
                .addChannel(new Tween<number>(tweenableY, 0 + noise(10), 1 + noise(0.1), EaseFunctions.linear)) // target x is 0 because our parent is the mixer
            )
            .add(new CallbackTween(() => this.destroy()))
    }

    update(dt: number) {
        this.tweenChain.update(dt)
        if (!this.isDestroyed) {
            this.sprite.rotation += dt * 5
        }
    }

    destroy() {
        this.sprite.destroy()
        this.isDestroyed = true
        updateables.splice(updateables.indexOf(this), 1)
    }
}