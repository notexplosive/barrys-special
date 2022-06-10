import { Point, Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from "./data/ingredient";
import { IsDoneFunction, Tween, TweenChain, WaitUntilTween, EaseFunction, EaseFunctions, CallbackTween, MultiplexTween, WaitSecondsTween, DynamicTween, Tweenable, TweenablePoint, ITween } from './data/tween';
import { createDropParticle, DropParticle } from './drop-particle';
import { currentMixture, Hand, Mixer, prop_hand, prop_mixer, updateables, prop_patron, addPoints, Camera, camera, dialogueBox } from './main';
import { Opinion } from "./ui/patron-sprite";

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
    function shakeCamera() {
        return new TweenChain()
            .add(new Tween(camera.tweenablePosition, addPoints(camera.downPosition, new Point(noise(5), 10)), 0.15, EaseFunctions.quadSlowFastSlow))
            .add(new Tween(camera.tweenablePosition, addPoints(camera.downPosition, new Point(noise(5), -10)), 0.15, EaseFunctions.quadSlowFastSlow))
    }

    animationTween.add(
        new MultiplexTween()
            .addChannel(
                new TweenChain()
                    .add(new Tween<Point>(prop_hand.tweenablePosition, prop_mixer.position, 0.75, EaseFunctions.quadSlowFastSlow))
                    .add(handAndMixerTogether(
                        (handAndMixer) => new DynamicTween(() =>
                            new Tween<Point>(handAndMixer.tweenablePosition, prop_hand.restingPosition, 0.25, EaseFunctions.quadSlowFast))))
            )
            .addChannel(new Tween(camera.tweenablePosition, camera.downPosition, 0.75, EaseFunctions.quadFastSlow))
    )

    animationTween.add(new WaitSecondsTween(0.25))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new DynamicTween(shakeCamera))
    animationTween.add(new Tween(camera.tweenablePosition, camera.upPosition, 0.5, EaseFunctions.quadFastSlow))

    animationTween.add(handAndMixerTogether(
        (handAndMixer) => new DynamicTween(() =>
            new TweenChain()
                .add(new CallbackTween(() => { prop_mixer.becomeGlass(currentMixture) }))
                .add(new Tween<Point>(handAndMixer.tweenablePosition, new Point(prop_mixer.restingPosition.x, 200), 0.75, EaseFunctions.quadFastSlow))
                .add(new Tween<Point>(handAndMixer.tweenablePosition, new Point(prop_mixer.restingPosition.x, 235), 0.25, EaseFunctions.quadSlowFast))
        )))
    animationTween.add(new Tween(prop_hand.tweenablePosition, prop_hand.restingPosition, 1, EaseFunctions.quadSlowFastSlow))

    // patron drinks and reacts
    animationTween.add(new WaitSecondsTween(0.25))
    animationTween.add(new Tween(prop_mixer.tweenableRotation, -1, 0.25, EaseFunctions.quadFastSlow))
    animationTween.add(new CallbackTween(() => prop_mixer.drink()))
    animationTween.add(new Tween(prop_mixer.tweenableRotation, 0, 0.25, EaseFunctions.quadFastSlow))
    animationTween.add(new WaitSecondsTween(0.25))

    let reactionTween = new TweenChain();
    animationTween.add(new CallbackTween(() => {
        let reaction = prop_patron.getPatron().taste.getReactionToProfile(currentMixture.flavorProfile())
        let opinion = Opinion.Neutral

        if (reaction.dislikedFlavorCount() > 0) {
            opinion = Opinion.Dislike
        } else if (reaction.likedFlavorCount() > 0 && reaction.missingFlavorCount() == 0 || prop_patron.getPatron().taste.eatsAnything) {
            opinion = Opinion.Like
        }

        prop_patron.getPatron().patronSprite.showOpinion(opinion)

        if (opinion == Opinion.Like) {
            reactionTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, -25)), 0.15, EaseFunctions.quadFastSlow))
            reactionTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, 0)), 0.15, EaseFunctions.quadSlowFast))
            animate_showDialogue(reactionTween, () => {
                let patron = prop_patron.getPatron()
                patron.hasEnjoyedDrink = true
                return patron.dialogue.like
            })
        }

        if (opinion == Opinion.Neutral) {
            reactionTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, -10)), 0.5, EaseFunctions.quadFastSlow))

            if (reaction.likedFlavorCount() > 0) {
                animate_showDialogue(reactionTween, () => prop_patron.getPatron().dialogue.missingSomething(reaction))
            } else {
                animate_showDialogue(reactionTween, () => prop_patron.getPatron().dialogue.bland)
            }
        }

        if (opinion == Opinion.Dislike) {
            reactionTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, 25)), 0.5, EaseFunctions.quadFastSlow))
            animate_showDialogue(reactionTween, () => prop_patron.getPatron().dialogue.dislike(reaction))
        }

        reactionTween.add(new WaitSecondsTween(0.25))
    }))
    animationTween.add(reactionTween)


    // grab empty glass back
    animationTween.add(new Tween(prop_hand.tweenablePosition, prop_mixer.position, 1, EaseFunctions.quadSlowFastSlow))
    animationTween.add(handAndMixerTogether(
        (handAndMixer) => new DynamicTween(() =>
            new TweenChain()
                .add(new Tween(handAndMixer.tweenablePosition, prop_hand.restingPosition, 1, EaseFunctions.quadSlowFastSlow))

        )))

    // cleanup
    animationTween.add(new CallbackTween(() => {
        prop_hand.position = prop_hand.restingPosition;
        prop_mixer.becomeMixer()
    }))

    animate_patronLeaves()

    animationTween.add(new CallbackTween(() => {
        let isGameOver = prop_patron.rotatePatron()

        if (isGameOver) {
            console.log("The end!!")
        } else {
            animate_patronEnters()
            animate_spawnMixer()
        }
    }))
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

export function animate_patronEnters() {
    animationTween.add(new CallbackTween(() => {
        prop_patron.getPatron().patronSprite.showIntro()
        prop_patron.position = addPoints(prop_patron.entrancePosition, new Point(0, 50))
    }))
    animationTween.add(new Tween(camera.tweenablePosition, camera.upPosition, 0.5, EaseFunctions.quadSlowFastSlow))

    let travelTime = 2
    let bobAmount = 0.1
    animationTween.add(
        new MultiplexTween()
            .addChannel(
                new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, 50)), travelTime, EaseFunctions.quadFastSlow)
            )
            .addChannel(
                new TweenChain()
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, 0, 0.25, EaseFunctions.linear))
            )
    )
    animationTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, 55)), 0.3, EaseFunctions.quadSlowFast))
    animationTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, -30)), 0.25, EaseFunctions.quadFastSlow))
    animationTween.add(new Tween(prop_patron.tweenablePosition, prop_patron.restingPosition, 0.25, EaseFunctions.quadSlowFast))

    animationTween.add(new WaitSecondsTween(1))
    animate_showDialogue(animationTween, () => {
        let patron = prop_patron.getPatron()

        if (patron.hasBeenIntroduced) {
            return patron.dialogue.returnPage
        } else {
            patron.hasBeenIntroduced = true
            return patron.dialogue.introPage
        }
    })

    animationTween.add(new Tween(camera.tweenablePosition, camera.restingPosition, 0.5, EaseFunctions.quadSlowFastSlow))

}

export function animate_patronLeaves() {
    animationTween.add(new Tween(camera.tweenablePosition, camera.upPosition, 0.5, EaseFunctions.quadSlowFastSlow))

    animationTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, -30)), 0.25, EaseFunctions.quadFastSlow))
    animationTween.add(new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.restingPosition, new Point(0, 50)), 0.3, EaseFunctions.quadSlowFast))

    let travelTime = 2
    let bobAmount = 0.1
    animationTween.add(new CallbackTween(() => { prop_patron.position = addPoints(prop_patron.restingPosition, new Point(0, 50)) }))
    animationTween.add(
        new MultiplexTween()
            .addChannel(
                new Tween(prop_patron.tweenablePosition, addPoints(prop_patron.exitPosition, new Point(0, 50)), travelTime, EaseFunctions.quadSlowFast)
            )
            .addChannel(
                new TweenChain()
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, -bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, bobAmount, travelTime / 8, EaseFunctions.linear))
                    .add(new Tween(prop_patron.tweenableRotation, 0, 0.25, EaseFunctions.linear))
            )
    )
}

function animate_showDialogue(chain: TweenChain, getPage: () => string[]) {
    chain.add(new CallbackTween(() => {
        dialogueBox.loadPages(getPage())
    }))
    chain.add(new WaitUntilTween(() => dialogueBox.isDone()))
}
