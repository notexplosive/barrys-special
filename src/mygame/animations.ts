import { Point, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from "./data/ingredient";
import { IsDoneFunction, Tween, TweenChain, WaitUntilTween, EaseFunction, EaseFunctions, CallbackTween, MultiplexTween, WaitSecondsTween, DynamicTween, Tweenable, TweenablePoint, ITween } from './data/tween';
import { createDropParticle, DropParticle } from './drop-particle';
import { cameraRestingPosition, currentMixture, Hand, Mixer, prop_hand, prop_mixer, updateables } from './main';

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
                        let particles: DropParticle[] = []
                        for (let i = 0; i < 10; i++) {
                            particles.push(createDropParticle(prop_hand, prop_mixer, ingredient, i))
                        }

                        let particlesMultiplex = new MultiplexTween()

                        for (let particle of particles) {
                            particlesMultiplex.addChannel(
                                new TweenChain()
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
                                    .add(new CallbackTween(() => particle.destroy()))
                            )
                        }


                        return particlesMultiplex
                    }))
            )
    )
        .add(new CallbackTween(() => {
            if (currentMixture.isFilled()) {
                animate_putOnLid()
            }
        }))
}

function addPoints(left: Point, right: Point) {
    return new Point(left.x + right.x, left.y + right.y)
}

function handAndMixerTogether(tweenGenerator: (handOrMixer: Mixer | Hand) => ITween) {
    return new DynamicTween(() => new MultiplexTween()
        .addChannel(
            tweenGenerator(prop_mixer)
        )
        .addChannel(
            tweenGenerator(prop_hand)
        ))
}

export function animate_mixAndServe() {
    const cameraTweenablePosition = new TweenablePoint(() => game.world.position, v => game.world.position = v)
    const cameraDownPosition = addPoints(cameraRestingPosition, new Point(0, -100))

    function shakeCamera() {
        return new TweenChain()
            .add(new Tween(cameraTweenablePosition, addPoints(cameraDownPosition, new Point(noise(5), 10)), 0.15, EaseFunctions.quadSlowFastSlow))
            .add(new Tween(cameraTweenablePosition, addPoints(cameraDownPosition, new Point(noise(5), -10)), 0.15, EaseFunctions.quadSlowFastSlow))
    }

    animationTween.add(
        new MultiplexTween()
            .addChannel(
                new TweenChain()
                    .add(new Tween<Point>(prop_hand.tweenablePosition, prop_mixer.position, 0.75, EaseFunctions.quadSlowFastSlow))
                    .add(handAndMixerTogether((handAndMixer) => new DynamicTween(() => new Tween<Point>(handAndMixer.tweenablePosition, new Point(handAndMixer.position.x, 1000), 0.25, EaseFunctions.quadSlowFast))))
            )
            .addChannel(new Tween(cameraTweenablePosition, cameraDownPosition, 0.75, EaseFunctions.quadFastSlow))
    )

    animationTween.add(new WaitSecondsTween(0.25))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new Tween(cameraTweenablePosition, addPoints(cameraRestingPosition, new Point(0, 100)), 0.5, EaseFunctions.quadFastSlow))

    animationTween.add(handAndMixerTogether(
        (handAndMixer) => new DynamicTween(() =>
            new TweenChain()
                .add(new CallbackTween(() => { prop_mixer.becomeGlass() }))
                .add(new Tween<Point>(handAndMixer.tweenablePosition, new Point(handAndMixer.position.x, 200), 0.75, EaseFunctions.quadFastSlow))
                .add(new Tween<Point>(handAndMixer.tweenablePosition, new Point(handAndMixer.position.x, 235), 0.25, EaseFunctions.quadSlowFast)))))
    animationTween.add(new Tween(prop_hand.tweenablePosition, prop_hand.restingPosition, 1, EaseFunctions.quadSlowFastSlow))


    animationTween.add(new WaitSecondsTween(5)) // temp

    animationTween.add(new CallbackTween(() => { prop_hand.position = prop_hand.restingPosition }))
    animationTween.add(new CallbackTween(() => { prop_mixer.becomeMixer() }))
}

export function animate_putOnLid() {
    animationTween.add(new CallbackTween(() => {
        prop_mixer.lid.visible = true
        prop_mixer.lid.y = -200
    }))

    animationTween.add(new Tween<number>(prop_mixer.lidTweenableY, 0, 0.15, EaseFunctions.quadSlowFast))
    animationTween.add(new Tween<number>(prop_mixer.lidTweenableY, -10, 0.1, EaseFunctions.quadFastSlow))
    animationTween.add(new Tween<number>(prop_mixer.lidTweenableY, 0, 0.1, EaseFunctions.quadSlowFast))
}

export function animate_removeLid() {
    animationTween.add(new Tween(prop_mixer.lidTweenableY, 5, 0.1, EaseFunctions.quadFastSlow))
    animationTween.add(new Tween(prop_mixer.lidTweenableY, -200, 0.2, EaseFunctions.quadSlowFast))
    animationTween.add(new WaitSecondsTween(0.15))
    animationTween.add(new Tween(prop_mixer.tweenablePosition, new Point(prop_mixer.position.x + 1000, prop_mixer.position.y), 0.5, EaseFunctions.quadSlowFast))
    animate_spawnMixer()
}

export function animate_spawnMixer() {
    animationTween.add(new CallbackTween(() => { prop_mixer.position = new Point(prop_mixer.restingPosition.x, 0) }))
    animationTween.add(new Tween(prop_mixer.tweenablePosition, prop_mixer.restingPosition, 0.5, EaseFunctions.quadSlowFast))
    animationTween.add(new Tween(prop_mixer.tweenablePosition, addPoints(prop_mixer.restingPosition, new Point(0, -10)), 0.15, EaseFunctions.quadFastSlow))
    animationTween.add(new Tween(prop_mixer.tweenablePosition, prop_mixer.restingPosition, 0.15, EaseFunctions.quadSlowFast))
    animationTween.add(new CallbackTween(() => prop_mixer.lid.visible = false))
}