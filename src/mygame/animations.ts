import { Point, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from "./data/ingredient";
import { IsDoneFunction, Tween, TweenChain, WaitUntilTween, EaseFunction, EaseFunctions, CallbackTween, MultiplexTween, WaitSecondsTween, DynamicTween } from './data/tween';
import { createDropParticle } from "./drop-particle";
import { prop_hand, prop_mixer, updateables } from './main';

export const animationTween = new TweenChain()

function noise(scale: number) {
    return (Math.random() - 0.5) * scale
}

export function animate_dropIngredients(ingredient: Ingredient) {

    let handTravelTime = 0.5

    animationTween.add(
        new MultiplexTween()
            .addChannel(
                new TweenChain()
                    .add(new Tween<Point>(prop_hand.tweenablePosition, prop_hand.activePosition, handTravelTime / 2, EaseFunctions.quadFastSlow))
                    .add(new Tween<Point>(prop_hand.tweenablePosition, prop_hand.restingPosition, handTravelTime / 2, EaseFunctions.quadSlowFast))

            )
            .addChannel(
                new TweenChain()
                    .add(new WaitSecondsTween(handTravelTime / 3))
                    .add(new DynamicTween(() => {
                        let particles = []
                        for (let i = 0; i < 10; i++) {
                            particles.push(createDropParticle(prop_hand, prop_mixer, ingredient, i))
                        }

                        let particlesMovementMultiplex = new MultiplexTween()

                        for (let particle of particles) {
                            particlesMovementMultiplex.addChannel(new TweenChain()
                                .add(new WaitSecondsTween(particle.delay))
                                .add(new MultiplexTween()
                                    // target x,y is 0,0 because we're parented to the mixer
                                    .addChannel(new Tween<number>(particle.tweenableX, 0 + noise(40), 0.25 + noise(0.1), EaseFunctions.quadFastSlow))
                                    .addChannel(
                                        new TweenChain()
                                            .add(new Tween<number>(particle.tweenableY, -200 + noise(10), 0.15 + noise(0.1), EaseFunctions.quadFastSlow))
                                            .add(new Tween<number>(particle.tweenableY, 0 + noise(10), 0.25 + noise(0.1), EaseFunctions.quadSlowFast))
                                    )
                                )
                            )
                        }

                        return particlesMovementMultiplex
                    }))
            )
    )
}

export function animate_mixAndServe() {
    prop_mixer.putOnLid()
}