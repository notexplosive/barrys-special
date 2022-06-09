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

    return new DropParticle(particleContainer, index / 120)
}

export class DropParticle {
    readonly sprite: Sprite;
    readonly tweenableX: TweenableNumber;
    readonly tweenableY: TweenableNumber;
    readonly delay: number;
    isDestroyed: boolean;

    constructor(sprite: Sprite, delay: number) {
        this.sprite = sprite
        this.delay = delay

        this.tweenableX = new TweenableNumber(() => this.sprite.x, value => this.sprite.x = value)
        this.tweenableY = new TweenableNumber(() => this.sprite.y, value => this.sprite.y = value)
    }

    update(dt: number) {
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