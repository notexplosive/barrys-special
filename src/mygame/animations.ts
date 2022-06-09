import { Point, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from "./data/ingredient";
import { IsDoneFunction, Tween, TweenChain, WaitUntilTween, EaseFunction, EaseFunctions, CallbackTween, MultiplexTween, WaitSecondsTween } from './data/tween';
import { createDropParticle } from "./drop-particle";
import { prop_hand, prop_mixer, updateables } from './main';

export const animationTween = new TweenChain()


export function animate_dropIngredients(ingredient: Ingredient) {

    let isDoneDropping = () => true // is overwritten in the callback

    let dropParticles = new CallbackTween(() => {
        let particles = [
            createDropParticle(prop_hand, prop_mixer, ingredient, 0),
            createDropParticle(prop_hand, prop_mixer, ingredient, 1),
            createDropParticle(prop_hand, prop_mixer, ingredient, 2),
            createDropParticle(prop_hand, prop_mixer, ingredient, 3),
            createDropParticle(prop_hand, prop_mixer, ingredient, 4),
            createDropParticle(prop_hand, prop_mixer, ingredient, 5),
            createDropParticle(prop_hand, prop_mixer, ingredient, 6),
            createDropParticle(prop_hand, prop_mixer, ingredient, 7),
        ]

        for (let particle of particles) {
            updateables.push(particle)
        }

        isDoneDropping = () => {
            for (let particle of particles) {
                if (!particle.tweenChain.isDone()) {
                    return false;
                }
            }

            return true;
        }
    })

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
                    .add(new WaitSecondsTween(handTravelTime / 4))
                    .add(dropParticles)
                    .add(new WaitUntilTween(() => isDoneDropping()))
            )
    )
}

export function animate_mixAndServe() {
    prop_mixer.putOnLid()
}